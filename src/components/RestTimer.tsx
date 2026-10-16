import { useEffect, useRef, useState } from 'react';
import { fmtClock } from '../format';

function beep() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.25, 0.5].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.25, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.18);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.2);
    });
  } catch { /* audio unavailable */ }
  try { navigator.vibrate?.([200, 100, 200]); } catch { /* not supported on iOS */ }
}

export function RestTimer({ endsAt, total, onChange, onDone }: {
  endsAt: number; total: number; onChange: (endsAt: number, total: number) => void; onDone: () => void;
}) {
  const [now, setNow] = useState(Date.now());
  const fired = useRef(false);

  useEffect(() => {
    fired.current = false;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [endsAt]);

  const left = (endsAt - now) / 1000;
  useEffect(() => {
    if (left <= 0 && !fired.current) {
      fired.current = true;
      beep();
      const id = setTimeout(onDone, 1500);
      return () => clearTimeout(id);
    }
  }, [left, onDone]);

  const pct = Math.max(0, Math.min(1, left / total));
  const adjust = (d: number) => onChange(endsAt + d * 1000, Math.max(1, total + d));

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 px-3 pb-safe">
      <div className="max-w-xl mx-auto mb-2 bg-[#2c2c2e]/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-sep/60">
        <div className="h-1 bg-accent transition-[width] duration-200 ease-linear" style={{ width: `${pct * 100}%` }} />
        <div className="flex items-center gap-2 px-3 py-2.5">
          <div className="flex-1">
            <div className="text-label2 text-[12px] font-semibold uppercase">{left > 0 ? 'Rest' : 'Go!'}</div>
            <div className="text-[28px] font-semibold tabular leading-none">{fmtClock(left)}</div>
          </div>
          <button type="button" onClick={() => adjust(-15)} className="bg-card2 rounded-lg px-3 py-2 font-semibold tabular">−15</button>
          <button type="button" onClick={() => adjust(15)} className="bg-card2 rounded-lg px-3 py-2 font-semibold tabular">+15</button>
          <button type="button" onClick={onDone} className="bg-accent rounded-lg px-3 py-2 font-semibold">Skip</button>
        </div>
      </div>
    </div>
  );
}
