import { useEffect, useState } from 'react';
import type { Settings } from '../db/schema';
import { calcPlates } from '../logic/plates';
import { fmtNumber, toDisplay } from '../logic/units';
import { NumInput, Sheet } from './ui';

const plateColor = (p: number, max: number) => {
  const r = p / max;
  if (r >= 0.9) return '#0a84ff';
  if (r >= 0.7) return '#ffd60a';
  if (r >= 0.5) return '#30d158';
  if (r >= 0.2) return '#ff9f0a';
  return '#e5e5ea';
};

export function PlateSheet({ open, onClose, initialLbs, settings }: {
  open: boolean; onClose: () => void; initialLbs: number; settings: Settings;
}) {
  const unit = settings.unit;
  const bar = unit === 'kg' ? settings.barKg : settings.barLbs;
  const plates = unit === 'kg' ? settings.platesKg : settings.platesLbs;
  const [target, setTarget] = useState<number | null>(null);

  useEffect(() => {
    if (open) setTarget(initialLbs > 0 ? Math.round(toDisplay(initialLbs, unit) * 100) / 100 : null);
  }, [open, initialLbs, unit]);

  const t = target ?? bar;
  const r = calcPlates(t, bar, plates);
  const max = Math.max(...plates);

  return (
    <Sheet open={open} title="Plate Calculator" onClose={onClose}>
      <div className="flex items-center gap-3">
        <NumInput value={target} onCommit={setTarget} placeholder={String(bar)} className="flex-1 text-[22px] font-semibold py-3" ariaLabel="Target weight" />
        <span className="text-label2 text-[17px]">{unit}</span>
      </div>
      <div className="text-label2 text-[13px] mt-2">Bar: {bar} {unit} · change in Settings</div>

      <div className="flex items-center justify-center my-8 h-36">
        <div className="h-3 w-10 bg-[#8e8e93] rounded-l" />
        <div className="flex items-center gap-[3px]">
          {r.perSide.map((p, i) => (
            <div
              key={i}
              className="rounded-[3px] flex items-center justify-center"
              style={{ width: 16, height: 40 + 96 * (p / max), background: plateColor(p, max) }}
            />
          ))}
        </div>
        <div className="h-3 w-6 bg-[#8e8e93] rounded-r" />
      </div>

      <div className="bg-card2 rounded-2xl p-4">
        <div className="text-label2 text-[13px] mb-1">Each side</div>
        <div className="text-[22px] font-semibold">
          {r.perSide.length ? r.perSide.map(fmtNumber).join(' + ') : 'Empty bar'}
        </div>
        {!r.exact && (
          <div className="text-[#ff9f0a] text-[14px] mt-2">
            {t < bar ? `Less than the bar (${bar} ${unit}).` : `Can't load exactly. Closest: ${fmtNumber(r.loaded)} ${unit}.`}
          </div>
        )}
      </div>
    </Sheet>
  );
}
