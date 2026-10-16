export interface PlateResult {
  /** Plates for ONE side of the bar, heaviest first. */
  perSide: number[];
  /** Weight actually loaded (bar + both sides). */
  loaded: number;
  /** True when the target can be loaded exactly. */
  exact: boolean;
}

/** Greedy plate fill. All values are in the same unit (lbs or kg). */
export function calcPlates(target: number, bar: number, plates: number[]): PlateResult {
  const sorted = [...plates].filter((p) => p > 0).sort((a, b) => b - a);
  let remaining = Math.max(0, (target - bar) / 2);
  const perSide: number[] = [];
  for (const p of sorted) {
    // Small epsilon absorbs float error from kg conversions.
    while (remaining + 1e-6 >= p) {
      perSide.push(p);
      remaining -= p;
    }
  }
  const loaded = bar + 2 * perSide.reduce((a, b) => a + b, 0);
  return { perSide, loaded, exact: target >= bar && Math.abs(loaded - target) < 1e-6 };
}
