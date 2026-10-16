import { useCallback, useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Exercise, type Session, type SessionExercise, type SetEntry, type Settings } from '../db/schema';
import { blankSet, finishWorkout, saveSession, sessionExercise } from '../actions';
import { useExerciseMap } from '../hooks';
import { categoryColor, fmtClock, fmtDate } from '../format';
import { lastSetsFor } from '../logic/stats';
import { nextWeightHint } from '../logic/progression';
import { fmtNumber, fmtWeight, fromDisplay, toDisplay } from '../logic/units';
import { ExercisePicker } from '../components/ExercisePicker';
import { PlateSheet } from '../components/PlateSheet';
import { RestTimer } from '../components/RestTimer';
import { Button, NumInput, Sheet } from '../components/ui';

const RPE_OPTIONS = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

interface Rest { endsAt: number; total: number }

function loadRest(id: number): Rest | null {
  try {
    const r = JSON.parse(sessionStorage.getItem(`rest-${id}`) ?? 'null') as Rest | null;
    return r && r.endsAt > Date.now() ? r : null;
  } catch { return null; }
}
function storeRest(id: number, r: Rest | null) {
  try {
    if (r) sessionStorage.setItem(`rest-${id}`, JSON.stringify(r));
    else sessionStorage.removeItem(`rest-${id}`);
  } catch { /* storage unavailable */ }
}

export function WorkoutScreen({ sessionId, settings, onClose }: { sessionId: number; settings: Settings; onClose: () => void }) {
  const loaded = useLiveQuery(async () => (await db.sessions.get(sessionId)) ?? null, [sessionId]);
  // The screen owns the workout while it's open: every edit builds on the
  // latest local copy and is then saved, so quick taps never overwrite each other.
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const latest = useRef<Session | null | undefined>(undefined);
  useEffect(() => {
    if (latest.current === undefined && loaded !== undefined) {
      latest.current = loaded;
      setSession(loaded);
    } else if (loaded === null) {
      setSession(null);
    }
  }, [loaded]);
  const allSessions = useLiveQuery(() => db.sessions.toArray(), []) ?? [];
  const exMap = useExerciseMap();
  const [rest, setRestState] = useState<Rest | null>(() => loadRest(sessionId));
  const [picker, setPicker] = useState<{ mode: 'add' } | { mode: 'swap'; index: number } | null>(null);
  const [pendingSwap, setPendingSwap] = useState<{ index: number; ex: Exercise } | null>(null);
  const [menu, setMenu] = useState<number | null>(null);
  const [plates, setPlates] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  const live = session?.endedAt == null;
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [live]);

  const setRest = useCallback((r: Rest | null) => { setRestState(r); storeRest(sessionId, r); }, [sessionId]);
  const clearRest = useCallback(() => setRest(null), [setRest]);

  // The workout was deleted elsewhere: leave this screen.
  useEffect(() => { if (session === null) onClose(); }, [session, onClose]);

  if (!session) return null;

  const mutate = (fn: (exs: SessionExercise[]) => void, extra: Partial<Session> = {}) => {
    const cur = latest.current;
    if (!cur) return;
    const exercises: SessionExercise[] = structuredClone(cur.exercises);
    fn(exercises);
    const next = { ...cur, ...extra, exercises };
    latest.current = next;
    setSession(next);
    void saveSession(next);
  };
  const unit = settings.unit;

  const finish = async () => {
    const anyDone = session.exercises.some((e) => e.sets.some((s) => s.done));
    if (!anyDone) {
      if (confirm('No sets are checked off. Discard this workout?')) { await db.sessions.delete(sessionId); setRest(null); onClose(); }
      return;
    }
    const left = session.exercises.reduce((a, e) => a + e.sets.filter((s) => !s.done).length, 0);
    if (left > 0 && !confirm(`${left} unchecked set${left === 1 ? '' : 's'} will be removed. Finish workout?`)) return;
    await finishWorkout(sessionId);
    setRest(null);
    onClose();
  };

  const remove = async () => {
    if (!confirm(live ? 'Discard this workout? Nothing will be saved.' : 'Delete this workout from your history?')) return;
    await db.sessions.delete(sessionId);
    setRest(null);
    onClose();
  };

  const applySwap = async (index: number, ex: Exercise, updatePlan: boolean) => {
    const old = session.exercises[index];
    mutate((exs) => {
      exs[index] = { ...sessionExercise(ex, old.sets.length, old.repMin, old.repMax, old.restSec) };
    });
    if (updatePlan && session.templateId != null) {
      const t = await db.templates.get(session.templateId);
      if (t) {
        const items = t.items.map((it) => (it.exerciseId === old.exerciseId ? { ...it, exerciseId: ex.id! } : it));
        await db.templates.update(t.id!, { items });
      }
    }
    setPendingSwap(null);
  };

  const color = categoryColor[session.category];
  const menuEx = menu != null ? session.exercises[menu] : null;
  const plateEx = plates != null ? session.exercises[plates] : null;

  return (
    <div className="min-h-screen pb-40">
      <header className="sticky top-0 z-30 bg-black/85 backdrop-blur-xl border-b border-sep/60 pt-safe">
        <div className="flex items-center justify-between px-4 py-2.5">
          <button type="button" onClick={onClose} className="text-accent text-[17px] py-1 pr-2">‹ {live ? 'Back' : 'History'}</button>
          <div className="text-center">
            <div className="font-semibold flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />{session.name}
            </div>
            <div className="text-label2 text-[12px] tabular">
              {live ? fmtClock((now - session.startedAt) / 1000) : fmtDate(session.startedAt)}
            </div>
          </div>
          {live ? (
            <button type="button" onClick={finish} className="bg-[#30d158] text-black font-semibold rounded-full px-4 py-1.5">Finish</button>
          ) : (
            <button type="button" onClick={onClose} className="text-accent font-semibold text-[17px] py-1 pl-2">Done</button>
          )}
        </div>
      </header>

      <div className="px-3 pt-3 space-y-3 max-w-xl mx-auto">
        {session.exercises.map((se, i) => {
          const ex = exMap.get(se.exerciseId);
          if (!ex) return null;
          return (
            <ExerciseCard
              key={`${i}-${se.exerciseId}`}
              ex={ex}
              se={se}
              unit={unit}
              live={live}
              last={lastSetsFor(allSessions, se.exerciseId, sessionId)}
              onMenu={() => setMenu(i)}
              onUpdate={(f) => mutate((exs) => { exs[i] = f(exs[i]); })}
              onRest={(sec) => live && sec > 0 && setRest({ endsAt: Date.now() + sec * 1000, total: sec })}
            />
          );
        })}

        <Button kind="secondary" className="w-full" onClick={() => setPicker({ mode: 'add' })}>+ Add Exercise</Button>

        <textarea
          value={session.notes}
          onChange={(e) => mutate(() => {}, { notes: e.target.value })}
          placeholder="Workout notes (how you felt, gym, anything)…"
          rows={3}
          className="w-full bg-card rounded-2xl px-4 py-3 outline-none placeholder:text-label2 resize-none"
        />

        <Button kind="danger" className="w-full" onClick={remove}>{live ? 'Discard Workout' : 'Delete Workout'}</Button>
      </div>

      {rest && live && (
        <RestTimer endsAt={rest.endsAt} total={rest.total} onChange={(endsAt, total) => setRest({ endsAt, total })} onDone={clearRest} />
      )}

      <ExercisePicker
        open={picker != null}
        title={picker?.mode === 'swap' ? 'Swap Exercise' : 'Add Exercise'}
        onClose={() => setPicker(null)}
        onPick={(ex) => {
          if (picker?.mode === 'swap') {
            if (session.templateId != null) setPendingSwap({ index: picker.index, ex });
            else void applySwap(picker.index, ex, false);
          } else {
            const isCardio = ex.type === 'cardio';
            mutate((exs) => { exs.push(sessionExercise(ex, isCardio ? 1 : 3, isCardio ? 0 : 8, isCardio ? 0 : 12, isCardio ? 0 : settings.restSec)); });
          }
        }}
      />

      <Sheet open={pendingSwap != null} title="Swap Exercise" onClose={() => setPendingSwap(null)}>
        {pendingSwap && (
          <div className="space-y-3">
            <p className="text-label2 text-[15px]">Use <b className="text-white">{pendingSwap.ex.name}</b> just today, or make it part of {session.name} from now on?</p>
            <Button className="w-full" onClick={() => applySwap(pendingSwap.index, pendingSwap.ex, false)}>Just this workout</Button>
            <Button kind="secondary" className="w-full" onClick={() => applySwap(pendingSwap.index, pendingSwap.ex, true)}>Also update {session.name}</Button>
          </div>
        )}
      </Sheet>

      <Sheet open={menuEx != null} title={menuEx ? exMap.get(menuEx.exerciseId)?.name ?? '' : ''} onClose={() => setMenu(null)}>
        {menu != null && menuEx && (
          <div className="space-y-2">
            {exMap.get(menuEx.exerciseId)?.type === 'strength' && (
              <Button kind="secondary" className="w-full" onClick={() => { setPlates(menu); setMenu(null); }}>Plate calculator</Button>
            )}
            <Button kind="secondary" className="w-full" onClick={() => { setPicker({ mode: 'swap', index: menu }); setMenu(null); }}>Swap exercise</Button>
            <div className="flex gap-2">
              <Button kind="secondary" className="flex-1" disabled={menu === 0} onClick={() => { mutate((exs) => { [exs[menu - 1], exs[menu]] = [exs[menu], exs[menu - 1]]; }); setMenu(null); }}>Move up</Button>
              <Button kind="secondary" className="flex-1" disabled={menu === session.exercises.length - 1} onClick={() => { mutate((exs) => { [exs[menu + 1], exs[menu]] = [exs[menu], exs[menu + 1]]; }); setMenu(null); }}>Move down</Button>
            </div>
            <div className="pt-1">
              <div className="text-label2 text-[13px] mb-1 px-1">Rest between sets</div>
              <div className="grid grid-cols-5 gap-2">
                {[60, 90, 120, 150, 180].map((s) => (
                  <button key={s} type="button" onClick={() => mutate((exs) => { exs[menu].restSec = s; })}
                    className={`rounded-lg py-2 font-semibold tabular ${menuEx.restSec === s ? 'bg-accent' : 'bg-card2'}`}>{fmtClock(s)}</button>
                ))}
              </div>
            </div>
            <Button kind="danger" className="w-full !mt-4" onClick={() => { mutate((exs) => { exs.splice(menu, 1); }); setMenu(null); }}>Remove exercise</Button>
          </div>
        )}
      </Sheet>

      <PlateSheet
        open={plateEx != null}
        onClose={() => setPlates(null)}
        settings={settings}
        initialLbs={plateEx ? Math.max(0, ...plateEx.sets.map((s) => s.weight)) || nextWeightHintFor(plateEx, exMap, allSessions, sessionId, unit) : 0}
      />
    </div>
  );
}

function nextWeightHintFor(se: SessionExercise, exMap: Map<number, Exercise>, sessions: Session[], sessionId: number, unit: Settings['unit']): number {
  const ex = exMap.get(se.exerciseId);
  if (!ex) return 0;
  return nextWeightHint(lastSetsFor(sessions, se.exerciseId, sessionId), se.repMax, ex.region, unit)?.weight ?? 0;
}

function ExerciseCard({ ex, se, unit, live, last, onMenu, onUpdate, onRest }: {
  ex: Exercise; se: SessionExercise; unit: Settings['unit']; live: boolean; last: SetEntry[];
  onMenu: () => void; onUpdate: (f: (se: SessionExercise) => SessionExercise) => void; onRest: (sec: number) => void;
}) {
  const cardio = ex.type === 'cardio';
  const bodyweight = ex.type === 'bodyweight';
  const lastWorking = last.filter((s) => !s.warmup);
  const hint = cardio ? null : nextWeightHint(last, se.repMax, ex.region, unit);

  const update = (i: number, patch: Partial<SetEntry>) =>
    onUpdate((cur) => ({ ...cur, sets: cur.sets.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));

  // Suggested values shown as grey placeholders; checking a set off accepts them.
  const suggest = (i: number) => {
    const s = se.sets[i];
    if (s.warmup) return { weight: undefined, reps: undefined };
    const wi = se.sets.slice(0, i).filter((x) => !x.warmup).length;
    const prev = lastWorking[wi] ?? lastWorking[lastWorking.length - 1];
    // Follow the weight already used today; otherwise the hint or last time's weight.
    const today = se.sets.slice(0, i).filter((x) => !x.warmup && x.weight > 0).pop();
    const weight = today?.weight ?? hint?.weight ?? prev?.weight;
    const reps = hint?.kind === 'increase' ? se.repMin || undefined : prev?.reps ?? (se.repMax || undefined);
    return { weight, reps };
  };

  const toggle = (i: number) => {
    const s = se.sets[i];
    if (s.done) { update(i, { done: false }); return; }
    const sug = suggest(i);
    const patch: Partial<SetEntry> = { done: true };
    if (!cardio) {
      if (!s.weight && sug.weight) patch.weight = sug.weight;
      if (!s.reps && sug.reps) patch.reps = sug.reps;
    }
    update(i, patch);
    if (!cardio) onRest(s.warmup ? Math.min(60, se.restSec) : se.restSec);
  };

  const target = cardio ? 'Cardio' : se.repMax ? `${se.sets.filter((s) => !s.warmup).length} × ${se.repMin === se.repMax ? se.repMax : `${se.repMin}–${se.repMax}`}` : '';
  const lastText = cardio
    ? last.map((s) => `${s.minutes ?? 0} min${s.distance ? ` · ${s.distance} mi` : ''}`).join(', ')
    : lastWorking.map((s) => `${bodyweight && !s.weight ? 'BW' : fmtWeight(s.weight, unit)}×${s.reps}`).join(', ');

  return (
    <div className="bg-card rounded-2xl overflow-hidden">
      <button type="button" onClick={onMenu} className="w-full text-left px-4 pt-3.5 pb-2 flex items-start gap-2 active:opacity-70">
        <div className="flex-1 min-w-0">
          <div className="text-[17px] font-semibold text-accent truncate">{ex.name}</div>
          <div className="text-label2 text-[13px]">
            {target}{target && !cardio && ` · rest ${fmtClock(se.restSec)}`}
          </div>
        </div>
        <span className="text-label2 text-[22px] leading-none mt-0.5" aria-label="Exercise options">⋯</span>
      </button>

      {(lastText || hint) && (
        <div className="px-4 pb-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
          {lastText && <span className="text-label2">Last: <span className="text-[#c7c7cc]">{lastText}</span></span>}
          {hint && (
            <span className={hint.kind === 'increase' ? 'text-[#30d158] font-semibold' : 'text-[#ff9f0a]'}>
              {hint.kind === 'increase' ? `↑ Try ${fmtWeight(hint.weight, unit, true)}` : `= Stay at ${fmtWeight(hint.weight, unit, true)}`}
            </span>
          )}
        </div>
      )}

      <div className="px-2 pb-2">
        <div className={`grid ${cardio ? 'grid-cols-[2.5rem_1fr_1fr_2.75rem]' : 'grid-cols-[2.5rem_1fr_1fr_4.25rem_2.75rem]'} gap-1.5 px-1 text-[11px] font-semibold text-label2 uppercase pb-1`}>
          <div className="text-center">Set</div>
          {cardio ? (<><div className="text-center">Min</div><div className="text-center">Miles</div></>) : (
            <><div className="text-center">{bodyweight ? `+${unit}` : unit}</div><div className="text-center">Reps</div><div className="text-center">RPE</div></>
          )}
          <div className="text-center">✓</div>
        </div>
        {se.sets.map((s, i) => {
          const sug = suggest(i);
          const workingNo = se.sets.slice(0, i + 1).filter((x) => !x.warmup).length;
          return (
            <div
              key={i}
              className={`grid ${cardio ? 'grid-cols-[2.5rem_1fr_1fr_2.75rem]' : 'grid-cols-[2.5rem_1fr_1fr_4.25rem_2.75rem]'} gap-1.5 items-center px-1 py-1 rounded-lg ${s.done ? 'bg-[#30d158]/15' : ''}`}
            >
              <button
                type="button"
                onClick={() => !cardio && update(i, { warmup: !s.warmup })}
                className={`h-9 rounded-lg font-bold text-[15px] tabular ${s.warmup ? 'text-[#ff9f0a]' : 'text-white'}`}
                aria-label={s.warmup ? 'Warm-up set, tap to make working set' : 'Working set, tap to make warm-up'}
              >
                {s.warmup ? 'W' : workingNo}
              </button>
              {cardio ? (
                <>
                  <NumInput value={s.minutes ?? null} onCommit={(v) => update(i, { minutes: v ?? undefined })} placeholder="0" ariaLabel="Minutes" />
                  <NumInput value={s.distance ?? null} onCommit={(v) => update(i, { distance: v ?? undefined })} placeholder="0" ariaLabel="Miles" />
                </>
              ) : (
                <>
                  <NumInput
                    value={s.weight ? Math.round(toDisplay(s.weight, unit) * 100) / 100 : null}
                    onCommit={(v) => update(i, { weight: v == null ? 0 : fromDisplay(v, unit) })}
                    placeholder={sug.weight ? fmtNumber(toDisplay(sug.weight, unit)) : bodyweight ? 'BW' : '—'}
                    ariaLabel="Weight"
                  />
                  <NumInput
                    value={s.reps || null}
                    onCommit={(v) => update(i, { reps: v == null ? 0 : Math.round(v) })}
                    placeholder={sug.reps ? String(sug.reps) : '—'}
                    step="1"
                    ariaLabel="Reps"
                  />
                  <select
                    value={s.rpe ?? ''}
                    onChange={(e) => update(i, { rpe: e.target.value === '' ? null : Number(e.target.value) })}
                    className={`min-w-0 bg-card2 rounded-lg py-2 text-center outline-none appearance-none tabular ${s.rpe == null ? 'text-[#636366]' : ''}`}
                    aria-label="RPE"
                  >
                    <option value="">—</option>
                    {RPE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </>
              )}
              <button
                type="button"
                onClick={() => toggle(i)}
                className={`h-9 rounded-lg flex items-center justify-center ${s.done ? 'bg-[#30d158] text-black' : 'bg-card2 text-label2'}`}
                aria-label={s.done ? 'Mark set not done' : 'Mark set done'}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8.5 3 3 7-7" /></svg>
              </button>
            </div>
          );
        })}
        <div className="flex gap-2 pt-1.5 px-1">
          <button
            type="button"
            onClick={() => onUpdate((cur) => {
              const lastSet = cur.sets[cur.sets.length - 1];
              const next = { ...blankSet(ex), weight: lastSet && !lastSet.warmup ? lastSet.weight : 0 };
              return { ...cur, sets: [...cur.sets, next] };
            })}
            className="flex-1 bg-card2 rounded-lg py-2 text-[14px] font-semibold"
          >
            + Add Set
          </button>
          {se.sets.length > 1 && (
            <button
              type="button"
              onClick={() => onUpdate((cur) => ({ ...cur, sets: cur.sets.slice(0, -1) }))}
              className="bg-card2 rounded-lg py-2 px-4 text-[14px] font-semibold text-label2"
            >
              − Set
            </button>
          )}
        </div>
        {!live && <div className="h-1" />}
      </div>
    </div>
  );
}
