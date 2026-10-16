import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { db, type Settings } from '../db/schema';
import { useExerciseMap } from '../hooks';
import { progressFor } from '../logic/stats';
import { fmtNumber, fmtWeight, fmtWhole, toDisplay } from '../logic/units';
import { fmtCompact, fmtDate } from '../format';
import { Card, Chevron, Empty, Page, SectionTitle, Segmented, Sheet } from '../components/ui';

type Metric = 'top' | 'e1rm' | 'volume';
const metricLabel: Record<Metric, string> = { top: 'Heaviest set', e1rm: 'Est. 1-rep max', volume: 'Volume' };

const LINE = '#0a84ff';
const AXIS = '#8e8e93';
const GRID = '#2c2c2e';

interface Point { date: number; value: number }

function TrendChart({ data, unit, label }: { data: Point[]; unit: string; label: string }) {
  return (
    <div className="h-[220px] -ml-2" role="img" aria-label={`${label} over time`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(d: number) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            tick={{ fill: AXIS, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            domain={['auto', 'auto']}
            allowDecimals={false}
            tickFormatter={(v: number) => fmtCompact(v)}
            tick={{ fill: AXIS, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip
            cursor={{ stroke: AXIS, strokeWidth: 1 }}
            contentStyle={{ background: '#2c2c2e', border: 'none', borderRadius: 10, color: '#fff' }}
            labelStyle={{ color: AXIS, fontSize: 12 }}
            itemStyle={{ color: '#fff' }}
            labelFormatter={(d: number) => fmtDate(d)}
            formatter={(v: number) => [`${fmtNumber(Math.round(v * 10) / 10)} ${unit}`, label]}
          />
          <Line
            type="linear"
            dataKey="value"
            stroke={LINE}
            strokeWidth={2}
            dot={{ r: 4, fill: LINE, stroke: '#1c1c1e', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: LINE, stroke: '#1c1c1e', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProgressScreen({ settings }: { settings: Settings }) {
  const sessions = useLiveQuery(() => db.sessions.toArray(), []) ?? [];
  const bodyWeight = useLiveQuery(() => db.bodyWeight.orderBy('date').toArray(), []) ?? [];
  const exMap = useExerciseMap();
  const unit = settings.unit;
  const [metric, setMetric] = useState<Metric>('top');
  const [picked, setPicked] = useState<number | null>(null);
  const [choosing, setChoosing] = useState(false);

  // Exercises with logged data, most frequently trained first.
  const trained = useMemo(() => {
    const counts = new Map<number, number>();
    for (const s of sessions) {
      if (s.endedAt == null) continue;
      for (const e of s.exercises) {
        if (e.sets.some((x) => x.done && !x.warmup && x.weight > 0)) counts.set(e.exerciseId, (counts.get(e.exerciseId) ?? 0) + 1);
      }
    }
    return [...counts].sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ id, n }));
  }, [sessions]);

  const exerciseId = picked ?? trained[0]?.id ?? null;
  const ex = exerciseId != null ? exMap.get(exerciseId) : undefined;
  const points = exerciseId != null ? progressFor(sessions, exerciseId) : [];
  const series: Point[] = points.map((p) => ({ date: p.date, value: toDisplay(p[metric], unit) }));
  const best = points.length ? Math.max(...points.map((p) => p.top)) : 0;
  const bestE1rm = points.length ? Math.max(...points.map((p) => p.e1rm)) : 0;
  const change = points.length >= 2 ? points[points.length - 1].e1rm - points[0].e1rm : 0;

  const bwSeries: Point[] = bodyWeight.map((b) => ({ date: b.date, value: toDisplay(b.lbs, unit) }));
  const bwChange = bodyWeight.length >= 2 ? bodyWeight[bodyWeight.length - 1].lbs - bodyWeight[0].lbs : 0;

  return (
    <Page title="Progress">
      {trained.length === 0 ? (
        <Empty>Finish a workout with weighted sets and your strength charts will show up here.</Empty>
      ) : (
        <>
          <Card className="px-4 py-3 flex items-center gap-3" onClick={() => setChoosing(true)}>
            <div className="flex-1 min-w-0">
              <div className="text-label2 text-[13px]">Exercise</div>
              <div className="text-[17px] font-semibold truncate">{ex?.name ?? '—'}</div>
            </div>
            <Chevron />
          </Card>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <Stat label="Best set" value={fmtWeight(best, unit)} unit={unit} />
            <Stat label="Best est. 1RM" value={fmtWhole(bestE1rm, unit)} unit={unit} />
            <Stat label="Change" value={`${change >= 0 ? '+' : '−'}${fmtWhole(Math.abs(change), unit)}`} unit={unit} />
          </div>

          <Card className="p-4 mt-3">
            <Segmented value={metric} onChange={setMetric} options={[
              { value: 'top', label: 'Heaviest' }, { value: 'e1rm', label: 'Est. 1RM' }, { value: 'volume', label: 'Volume' },
            ]} />
            <div className="text-[15px] font-semibold mt-4 mb-1">{metricLabel[metric]} <span className="text-label2 font-normal">({unit})</span></div>
            {series.length >= 2 ? (
              <TrendChart data={series} unit={unit} label={metricLabel[metric]} />
            ) : (
              <div className="text-label2 text-[15px] py-8 text-center">Log this exercise one more time to see a trend line.</div>
            )}
            <p className="text-label2 text-[12px] mt-2">
              Est. 1RM (one-rep max) is the most you could likely lift once, estimated from your sets. Volume = weight × reps, added up. Warm-ups are left out.
            </p>
          </Card>

          <SectionTitle>Sessions</SectionTitle>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-2 text-label2 text-[12px] font-semibold uppercase border-b border-sep/60">
              <span>Date</span><span className="text-right">Heaviest</span><span className="text-right">Est. 1RM</span>
            </div>
            {[...points].reverse().slice(0, 12).map((p) => (
              <div key={p.date} className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-2.5 border-b border-sep/60 last:border-b-0 tabular text-[15px]">
                <span>{fmtDate(p.date)}</span>
                <span className="text-right">{fmtWeight(p.top, unit)}</span>
                <span className="text-right text-label2">{fmtWhole(p.e1rm, unit)}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      <SectionTitle>Body weight</SectionTitle>
      {bodyWeight.length === 0 ? (
        <Card className="p-4 text-label2 text-[15px]">Log your body weight from the Today tab to track it here.</Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Current" value={fmtWeight(bodyWeight[bodyWeight.length - 1].lbs, unit)} unit={unit} />
            <Stat label="Since first entry" value={`${bwChange >= 0 ? '+' : '−'}${fmtWeight(Math.abs(bwChange), unit)}`} unit={unit} />
          </div>
          {bwSeries.length >= 2 && (
            <Card className="p-4 mt-3">
              <div className="text-[15px] font-semibold mb-1">Body weight <span className="text-label2 font-normal">({unit})</span></div>
              <TrendChart data={bwSeries} unit={unit} label="Body weight" />
            </Card>
          )}
          <Card className="overflow-hidden mt-3">
            {[...bodyWeight].reverse().slice(0, 10).map((b) => (
              <div key={b.id} className="flex items-center px-4 py-2.5 border-b border-sep/60 last:border-b-0 text-[15px]">
                <span className="flex-1">{fmtDate(b.date)}</span>
                <span className="tabular font-semibold">{fmtWeight(b.lbs, unit, true)}</span>
                <button type="button" onClick={() => db.bodyWeight.delete(b.id!)} className="ml-4 text-label2 px-1" aria-label="Delete entry">✕</button>
              </div>
            ))}
          </Card>
        </>
      )}

      <Sheet open={choosing} title="Choose Exercise" onClose={() => setChoosing(false)}>
        <div className="bg-card2/50 rounded-2xl overflow-hidden">
          {trained.map(({ id, n }) => (
            <button key={id} type="button" onClick={() => { setPicked(id); setChoosing(false); }}
              className={`w-full flex justify-between text-left px-4 py-3 border-b border-sep/60 last:border-b-0 active:bg-card2 ${id === exerciseId ? 'text-accent' : ''}`}>
              <span className="font-medium">{exMap.get(id)?.name}</span>
              <span className="text-label2 text-[13px]">{n} session{n === 1 ? '' : 's'}</span>
            </button>
          ))}
        </div>
      </Sheet>
    </Page>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <Card className="p-3">
      <div className="text-label2 text-[12px]">{label}</div>
      <div className="text-[20px] font-bold tabular leading-tight mt-0.5">{value}<span className="text-[12px] text-label2 font-medium"> {unit}</span></div>
    </Card>
  );
}
