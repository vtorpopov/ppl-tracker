import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Category, type Exercise, type Settings, type Template } from '../db/schema';
import { hasTutorial } from '../data/guide';
import { useExerciseMap, useTemplates } from '../hooks';
import { defaultTargets } from '../actions';
import { categoryColor, categoryLabel, fmtClock } from '../format';
import { ExercisePicker, NewExerciseForm } from '../components/ExercisePicker';
import { ExerciseGuide, GuideButton } from '../components/ExerciseGuide';
import { Button, Card, Chevron, NumInput, Page, Row, SectionTitle, Segmented, Sheet } from '../components/ui';

type View = { kind: 'list' } | { kind: 'template'; id: number } | { kind: 'library' };

export function PlansScreen({ settings }: { settings: Settings }) {
  const [view, setView] = useState<View>({ kind: 'list' });
  if (view.kind === 'template') return <TemplateEditor id={view.id} settings={settings} onBack={() => setView({ kind: 'list' })} />;
  if (view.kind === 'library') return <Library onBack={() => setView({ kind: 'list' })} />;
  return <PlanList settings={settings} onOpen={(id) => setView({ kind: 'template', id })} onLibrary={() => setView({ kind: 'library' })} />;
}

function PlanList({ settings, onOpen, onLibrary }: { settings: Settings; onOpen: (id: number) => void; onLibrary: () => void }) {
  const templates = useTemplates();
  const exCount = useLiveQuery(() => db.exercises.count(), []) ?? 0;
  const [adding, setAdding] = useState(false);
  const byId = new Map(templates.map((t) => [t.id!, t]));
  const rotation = settings.rotation;
  const nextPos = rotation.length ? settings.nextIndex % rotation.length : -1;

  const setRotation = (r: number[], nextIndex = settings.nextIndex) =>
    db.settings.update('main', { rotation: r, nextIndex: r.length ? Math.min(nextIndex, r.length - 1) : 0 });

  const move = (i: number, d: number) => {
    const r = [...rotation];
    [r[i], r[i + d]] = [r[i + d], r[i]];
    // Keep the same workout marked as "next" after reordering.
    const n = nextPos === i ? i + d : nextPos === i + d ? i : nextPos;
    void setRotation(r, n);
  };

  const newTemplate = async () => {
    const id = await db.templates.add({ name: 'New Workout', category: 'push', items: [] });
    onOpen(id);
  };

  const groups: Category[] = ['push', 'pull', 'legs', 'other'];

  return (
    <Page title="Plans">
      <SectionTitle right={<button type="button" className="text-accent font-semibold" onClick={() => setAdding(true)}>Add</button>}>Rotation</SectionTitle>
      <p className="text-label2 text-[13px] px-1 -mt-1 mb-2">The order the Today tab suggests workouts in. Tap a row to make it next.</p>
      <Card className="overflow-hidden">
        {rotation.length === 0 && <div className="text-label2 px-4 py-4">Empty. Tap Add to build your rotation.</div>}
        {rotation.map((id, i) => {
          const t = byId.get(id);
          const isNext = i === nextPos;
          return (
            <div key={`${id}-${i}`} className="flex items-center gap-2 px-3 py-2 border-b border-sep/60 last:border-b-0">
              <span className="text-label2 w-5 text-center tabular text-[13px]">{i + 1}</span>
              <button type="button" className="flex-1 flex items-center gap-2 text-left py-1.5" onClick={() => db.settings.update('main', { nextIndex: i })}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: t ? categoryColor[t.category] : '#636366' }} />
                <span className="font-medium">{t?.name ?? 'Deleted workout'}</span>
                {isNext && <span className="text-[11px] font-bold uppercase bg-accent/20 text-accent rounded px-1.5 py-0.5">Next</span>}
              </button>
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="w-8 h-8 rounded-lg bg-card2 disabled:opacity-30" aria-label="Move up">↑</button>
              <button type="button" disabled={i === rotation.length - 1} onClick={() => move(i, 1)} className="w-8 h-8 rounded-lg bg-card2 disabled:opacity-30" aria-label="Move down">↓</button>
              <button type="button" onClick={() => setRotation(rotation.filter((_, j) => j !== i), i < nextPos ? nextPos - 1 : nextPos)} className="w-8 h-8 rounded-lg bg-card2 text-[#ff453a]" aria-label="Remove from rotation">✕</button>
            </div>
          );
        })}
      </Card>

      <SectionTitle right={<button type="button" className="text-accent font-semibold" onClick={newTemplate}>New</button>}>Workouts</SectionTitle>
      {groups.map((c) => {
        const list = templates.filter((t) => t.category === c);
        if (list.length === 0) return null;
        return (
          <div key={c} className="mb-3">
            <div className="text-[13px] font-semibold uppercase px-1 mb-1.5" style={{ color: categoryColor[c] }}>{categoryLabel[c]}</div>
            <Card className="overflow-hidden">
              {list.map((t) => (
                <Row key={t.id} onClick={() => onOpen(t.id!)}>
                  <div className="flex-1">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-label2 text-[13px]">{t.items.length} exercise{t.items.length === 1 ? '' : 's'}</div>
                  </div>
                  <Chevron />
                </Row>
              ))}
            </Card>
          </div>
        );
      })}

      <SectionTitle>Exercises</SectionTitle>
      <Card className="overflow-hidden">
        <Row onClick={onLibrary}>
          <div className="flex-1">
            <div className="font-medium">Exercise Library</div>
            <div className="text-label2 text-[13px]">{exCount} exercises</div>
          </div>
          <Chevron />
        </Row>
      </Card>

      <Sheet open={adding} title="Add to Rotation" onClose={() => setAdding(false)}>
        <div className="space-y-2">
          {templates.map((t) => (
            <button key={t.id} type="button" onClick={() => { void setRotation([...rotation, t.id!]); setAdding(false); }}
              className="w-full flex items-center gap-3 bg-card2 rounded-xl px-4 py-3 text-left active:opacity-70">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: categoryColor[t.category] }} />
              <span className="font-semibold">{t.name}</span>
            </button>
          ))}
        </div>
      </Sheet>
    </Page>
  );
}

function TemplateEditor({ id, settings, onBack }: { id: number; settings: Settings; onBack: () => void }) {
  const template = useLiveQuery(() => db.templates.get(id), [id]);
  const exMap = useExerciseMap();
  const [picking, setPicking] = useState(false);
  const [guide, setGuide] = useState<Exercise | null>(null);
  if (!template) return null;

  const save = (patch: Partial<Template>) => db.templates.update(id, patch);
  const setItem = (i: number, patch: Partial<Template['items'][number]>) =>
    save({ items: template.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) });
  const moveItem = (i: number, d: number) => {
    const items = [...template.items];
    [items[i], items[i + d]] = [items[i + d], items[i]];
    void save({ items });
  };

  const remove = async () => {
    if (!confirm(`Delete "${template.name}"? Past workouts stay in your history.`)) return;
    await db.transaction('rw', db.templates, db.settings, async () => {
      await db.templates.delete(id);
      const r = settings.rotation.filter((x) => x !== id);
      await db.settings.update('main', { rotation: r, nextIndex: r.length ? Math.min(settings.nextIndex, r.length - 1) : 0 });
    });
    onBack();
  };

  return (
    <div className="pt-safe px-4 pb-32 min-h-screen">
      <div className="py-2.5">
        <button type="button" onClick={onBack} className="text-accent text-[17px]">‹ Plans</button>
      </div>
      <input
        value={template.name}
        onChange={(e) => void save({ name: e.target.value })}
        className="w-full bg-transparent text-[30px] font-bold outline-none border-b border-sep/60 pb-1"
        aria-label="Workout name"
      />
      <div className="mt-4">
        <Segmented<Category> value={template.category} onChange={(c) => void save({ category: c })} options={[
          { value: 'push', label: 'Push' }, { value: 'pull', label: 'Pull' }, { value: 'legs', label: 'Legs' }, { value: 'other', label: 'Other' },
        ]} />
      </div>

      <SectionTitle>Exercises</SectionTitle>
      <div className="space-y-2">
        {template.items.map((it, i) => {
          const ex = exMap.get(it.exerciseId);
          const cardio = ex?.type === 'cardio';
          const timed = ex?.type === 'timed';
          return (
            <Card key={i} className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 font-semibold truncate">{ex?.name ?? 'Unknown exercise'}</div>
                {ex && <GuideButton onClick={() => setGuide(ex)} label={`How to do ${ex.name}`} />}
                <button type="button" disabled={i === 0} onClick={() => moveItem(i, -1)} className="w-8 h-8 rounded-lg bg-card2 disabled:opacity-30" aria-label="Move up">↑</button>
                <button type="button" disabled={i === template.items.length - 1} onClick={() => moveItem(i, 1)} className="w-8 h-8 rounded-lg bg-card2 disabled:opacity-30" aria-label="Move down">↓</button>
                <button type="button" onClick={() => void save({ items: template.items.filter((_, j) => j !== i) })} className="w-8 h-8 rounded-lg bg-card2 text-[#ff453a]" aria-label="Remove">✕</button>
              </div>
              {!cardio && (
                <div className="grid grid-cols-4 gap-2 mt-2.5 text-center">
                  <label className="text-label2 text-[11px] font-semibold uppercase">Sets
                    <NumInput value={it.sets} step="1" onCommit={(v) => v != null && v >= 1 && setItem(i, { sets: Math.round(v) })} className="w-full mt-1 text-white text-[16px]" />
                  </label>
                  <label className="text-label2 text-[11px] font-semibold uppercase">{timed ? 'Min sec' : 'Min reps'}
                    <NumInput value={it.repMin} step="1" onCommit={(v) => v != null && setItem(i, { repMin: Math.round(v) })} className="w-full mt-1 text-white text-[16px]" />
                  </label>
                  <label className="text-label2 text-[11px] font-semibold uppercase">{timed ? 'Max sec' : 'Max reps'}
                    <NumInput value={it.repMax} step="1" onCommit={(v) => v != null && setItem(i, { repMax: Math.round(v) })} className="w-full mt-1 text-white text-[16px]" />
                  </label>
                  <label className="text-label2 text-[11px] font-semibold uppercase">Rest
                    <select value={it.restSec} onChange={(e) => void setItem(i, { restSec: Number(e.target.value) })}
                      className="w-full mt-1 bg-card2 rounded-lg py-2 text-center text-white outline-none appearance-none">
                      {[30, 45, 60, 75, 90, 120, 150, 180, 240, 300].map((s) => <option key={s} value={s}>{fmtClock(s)}</option>)}
                    </select>
                  </label>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      <Button kind="secondary" className="w-full mt-3" onClick={() => setPicking(true)}>+ Add Exercise</Button>
      <p className="text-label2 text-[13px] mt-3 px-1">
        Next-weight hints: when you hit the max reps on every working set (at effort 8 or easier), the app suggests adding weight next time.
      </p>
      <Button kind="danger" className="w-full mt-6" onClick={remove}>Delete Workout</Button>

      <ExerciseGuide exercise={guide} onClose={() => setGuide(null)} />
      <ExercisePicker
        open={picking}
        onClose={() => setPicking(false)}
        onPick={(ex) => {
          const [sets, repMin, repMax, restSec] = defaultTargets(ex, settings.restSec);
          void save({ items: [...template.items, { exerciseId: ex.id!, sets, repMin, repMax, restSec }] });
        }}
      />
    </div>
  );
}

function Library({ onBack }: { onBack: () => void }) {
  const all = useLiveQuery(() => db.exercises.orderBy('name').toArray(), []) ?? [];
  const [q, setQ] = useState('');
  const [creating, setCreating] = useState(false);
  const [guide, setGuide] = useState<Exercise | null>(null);
  const filtered = useMemo(() => all.filter((e) => e.name.toLowerCase().includes(q.trim().toLowerCase())), [all, q]);
  const byMuscle = new Map<string, typeof all>();
  for (const e of filtered) byMuscle.set(e.muscle, [...(byMuscle.get(e.muscle) ?? []), e]);

  return (
    <div className="pt-safe px-4 pb-32 min-h-screen">
      <div className="py-2.5 flex justify-between">
        <button type="button" onClick={onBack} className="text-accent text-[17px]">‹ Plans</button>
        <button type="button" onClick={() => setCreating(true)} className="text-accent text-[17px] font-semibold">New</button>
      </div>
      <h1 className="text-[34px] font-bold tracking-tight pb-3">Exercises</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search"
        className="w-full bg-card rounded-xl px-3 py-2.5 outline-none placeholder:text-label2 mb-4" />
      {[...byMuscle].sort(([a], [b]) => a.localeCompare(b)).map(([muscle, list]) => (
        <div key={muscle} className="mb-4">
          <div className="text-label2 text-[13px] font-semibold uppercase px-1 mb-1.5">{muscle}</div>
          <Card className="overflow-hidden">
            {list.map((e) => (
              <Row key={e.id} onClick={() => setGuide(e)}>
                <div className="flex-1">
                  <div className="font-medium">{e.name}</div>
                  <div className="text-label2 text-[13px]">
                    {e.equipment}{e.type === 'bodyweight' ? ' · bodyweight' : e.type === 'timed' ? ' · timed' : ''}
                  </div>
                </div>
                <span className="text-accent text-[13px] font-semibold">{hasTutorial(e.name) ? 'How to' : ''}</span>
                <Chevron />
              </Row>
            ))}
          </Card>
        </div>
      ))}
      <ExerciseGuide exercise={guide} onClose={() => setGuide(null)} />
      <Sheet open={creating} title="New Exercise" onClose={() => setCreating(false)}>
        <NewExerciseForm initialName={q} onCancel={() => setCreating(false)} onCreated={() => setCreating(false)} />
      </Sheet>
    </div>
  );
}
