import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Settings, type Template } from '../db/schema';
import { skipNext, startWorkout } from '../actions';
import { useExerciseMap, useTemplates } from '../hooks';
import { nextTemplateId } from '../logic/rotation';
import { sessionVolume } from '../logic/stats';
import { fmtWeight, fromDisplay } from '../logic/units';
import { categoryColor, categoryLabel, fmtCompact, fmtDuration, fmtRelative } from '../format';
import { Button, Card, NumInput, Page, SectionTitle, Sheet } from '../components/ui';

export function TodayScreen({ settings, onOpenSession }: { settings: Settings; onOpenSession: (id: number) => void }) {
  const templates = useTemplates();
  const exMap = useExerciseMap();
  const active = useLiveQuery(() => db.sessions.filter((s) => s.endedAt == null).first(), []);
  const recent = useLiveQuery(() => db.sessions.orderBy('startedAt').reverse().filter((s) => s.endedAt != null).limit(30).toArray(), []) ?? [];
  const lastBw = useLiveQuery(() => db.bodyWeight.orderBy('date').last(), []);
  const [choosing, setChoosing] = useState(false);
  const [bw, setBw] = useState<number | null>(null);

  const nextId = nextTemplateId(settings.rotation, settings.nextIndex);
  const next = templates.find((t) => t.id === nextId);
  const last = recent[0];
  const weekAgo = Date.now() - 7 * 86400000;
  const thisWeek = recent.filter((s) => s.startedAt >= weekAgo).length;
  const unit = settings.unit;

  const start = async (t: Template | null) => {
    setChoosing(false);
    onOpenSession(await startWorkout(t));
  };

  const saveBw = async () => {
    if (bw == null || bw <= 0) return;
    await db.bodyWeight.add({ date: Date.now(), lbs: fromDisplay(bw, unit) });
    setBw(null);
  };

  const subtitle = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <Page title="Today" subtitle={subtitle}>
      {active ? (
        <Card className="p-5 border border-[#30d158]/40" onClick={() => onOpenSession(active.id!)}>
          <div className="text-[#30d158] text-[13px] font-semibold uppercase">In progress</div>
          <div className="text-[26px] font-bold mt-1">{active.name}</div>
          <div className="text-label2 text-[15px]">Started {new Date(active.startedAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</div>
          <div className="mt-4 bg-[#30d158] text-black text-center font-semibold rounded-xl py-3">Resume Workout</div>
        </Card>
      ) : next ? (
        <Card className="overflow-hidden">
          <div className="h-1.5" style={{ background: categoryColor[next.category] }} />
          <div className="p-5">
            <div className="text-[13px] font-semibold uppercase" style={{ color: categoryColor[next.category] }}>
              Next up · {categoryLabel[next.category]}
            </div>
            <div className="text-[30px] font-bold leading-tight mt-0.5">{next.name}</div>
            <ul className="mt-3 space-y-1">
              {next.items.map((it, i) => {
                const ex = exMap.get(it.exerciseId);
                return (
                  <li key={i} className="flex justify-between text-[15px]">
                    <span className="truncate pr-3">{ex?.name ?? '—'}</span>
                    <span className="text-label2 tabular shrink-0">
                      {ex?.type === 'cardio' ? 'cardio' : `${it.sets} × ${it.repMin === it.repMax ? it.repMax : `${it.repMin}–${it.repMax}`}${ex?.type === 'timed' ? 's' : ''}`}
                    </span>
                  </li>
                );
              })}
            </ul>
            <Button className="w-full mt-5 text-[17px] py-3.5" onClick={() => start(next)}>Start {next.name}</Button>
            <div className="flex gap-2 mt-2">
              <Button kind="secondary" className="flex-1" onClick={() => void skipNext()}>Skip</Button>
              <Button kind="secondary" className="flex-1" onClick={() => setChoosing(true)}>Choose another</Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-5">
          <div className="text-[17px] font-semibold">Your rotation is empty</div>
          <div className="text-label2 mt-1">Add workouts to it in the Plans tab, or start one now.</div>
          <Button className="w-full mt-4" onClick={() => setChoosing(true)}>Start a workout</Button>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 mt-3">
        <Card className="p-4">
          <div className="text-label2 text-[13px]">Last 7 days</div>
          <div className="text-[28px] font-bold tabular">{thisWeek}<span className="text-[15px] text-label2 font-medium"> workout{thisWeek === 1 ? '' : 's'}</span></div>
        </Card>
        <Card className="p-4">
          <div className="text-label2 text-[13px]">Body weight</div>
          <div className="text-[28px] font-bold tabular">
            {lastBw ? fmtWeight(lastBw.lbs, unit) : '—'}<span className="text-[15px] text-label2 font-medium"> {unit}</span>
          </div>
        </Card>
      </div>

      {last && (
        <>
          <SectionTitle>Last workout</SectionTitle>
          <Card className="p-4" onClick={() => onOpenSession(last.id!)}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: categoryColor[last.category] }} />
              <span className="font-semibold text-[17px]">{last.name}</span>
              <span className="text-label2 ml-auto text-[15px]">{fmtRelative(last.startedAt)}</span>
            </div>
            <div className="flex gap-5 mt-2 text-[15px]">
              <div><span className="text-label2">Time </span>{fmtDuration((last.endedAt ?? last.startedAt) - last.startedAt)}</div>
              <div><span className="text-label2">Sets </span>{last.exercises.reduce((a, e) => a + e.sets.filter((s) => !s.warmup).length, 0)}</div>
              <div><span className="text-label2">Volume </span>{fmtCompact(Number(fmtWeight(sessionVolume(last), unit)))} {unit}</div>
            </div>
          </Card>
        </>
      )}

      <SectionTitle>Log body weight</SectionTitle>
      <Card className="p-3 flex gap-2 items-center">
        <NumInput value={bw} onCommit={setBw} placeholder={lastBw ? fmtWeight(lastBw.lbs, unit) : `Weight in ${unit}`} className="flex-1 text-left px-3" ariaLabel="Body weight" />
        <Button onClick={saveBw} disabled={bw == null || bw <= 0} className="py-2">Save</Button>
      </Card>

      <Sheet open={choosing} title="Choose Workout" onClose={() => setChoosing(false)}>
        <div className="space-y-2">
          {templates.map((t) => (
            <button key={t.id} type="button" onClick={() => start(t)} className="w-full flex items-center gap-3 bg-card2 rounded-xl px-4 py-3 text-left active:opacity-70">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: categoryColor[t.category] }} />
              <span className="font-semibold flex-1">{t.name}</span>
              <span className="text-label2 text-[13px]">{t.items.length} exercise{t.items.length === 1 ? '' : 's'}</span>
            </button>
          ))}
          <button type="button" onClick={() => start(null)} className="w-full bg-card2 rounded-xl px-4 py-3 text-left font-semibold text-accent active:opacity-70">
            + Empty workout
          </button>
          <p className="text-label2 text-[13px] pt-2 px-1">Doing a different Push/Pull/Legs day moves your rotation to continue after it. Other workouts (like Cardio) don't change it.</p>
        </div>
      </Sheet>
    </Page>
  );
}
