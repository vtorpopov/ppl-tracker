import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Settings } from '../db/schema';
import { useExerciseMap } from '../hooks';
import { sessionVolume } from '../logic/stats';
import { fmtWeight } from '../logic/units';
import { categoryColor, fmtCompact, fmtDuration } from '../format';
import { Card, Chevron, Empty, Page } from '../components/ui';

export function HistoryScreen({ settings, onOpenSession }: { settings: Settings; onOpenSession: (id: number) => void }) {
  const sessions = useLiveQuery(() => db.sessions.orderBy('startedAt').reverse().filter((s) => s.endedAt != null).toArray(), []);
  const exMap = useExerciseMap();
  const unit = settings.unit;

  if (!sessions) return <Page title="History"><div /></Page>;

  // Group by month.
  const groups = new Map<string, typeof sessions>();
  for (const s of sessions) {
    const key = new Date(s.startedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }

  return (
    <Page title="History">
      {sessions.length === 0 && <Empty>No workouts yet. Finished workouts show up here, and you can tap any one to edit it.</Empty>}
      {[...groups].map(([month, list]) => (
        <section key={month} className="mb-6">
          <h2 className="text-label2 text-[13px] font-semibold uppercase px-1 mb-2">{month} · {list.length}</h2>
          <div className="space-y-2">
            {list.map((s) => {
              const d = new Date(s.startedAt);
              return (
                <Card key={s.id} className="p-3.5 flex gap-3.5 items-center" onClick={() => onOpenSession(s.id!)}>
                  <div className="w-11 text-center shrink-0">
                    <div className="text-label2 text-[11px] font-semibold uppercase">{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                    <div className="text-[22px] font-bold leading-tight tabular">{d.getDate()}</div>
                  </div>
                  <div className="w-1 self-stretch rounded-full" style={{ background: categoryColor[s.category] }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-label2 text-[13px] truncate">
                      {s.exercises.map((e) => exMap.get(e.exerciseId)?.name).filter(Boolean).join(', ')}
                    </div>
                    <div className="text-label2 text-[13px] tabular">
                      {fmtDuration((s.endedAt ?? s.startedAt) - s.startedAt)} · {fmtCompact(Number(fmtWeight(sessionVolume(s), unit)))} {unit}
                      {s.notes && ' · 📝'}
                    </div>
                  </div>
                  <Chevron />
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </Page>
  );
}
