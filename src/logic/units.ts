import type { Unit } from '../db/schema';

export const LBS_PER_KG = 2.20462262;

/** Convert a stored (lbs) weight to the display unit. */
export function toDisplay(lbs: number, unit: Unit): number {
  return unit === 'kg' ? lbs / LBS_PER_KG : lbs;
}

/** Convert a weight typed in the display unit to stored lbs. */
export function fromDisplay(value: number, unit: Unit): number {
  return unit === 'kg' ? value * LBS_PER_KG : value;
}

/** Round to at most 2 decimals and drop trailing zeros: 100, 102.5, 61.25. */
export function fmtNumber(n: number): string {
  return String(Math.round(n * 100) / 100);
}

/** Whole-number weight, for estimates where decimals are noise. */
export function fmtWhole(lbs: number, unit: Unit): string {
  return String(Math.round(toDisplay(lbs, unit)));
}

export function fmtWeight(lbs: number, unit: Unit, withUnit = false): string {
  const s = fmtNumber(toDisplay(lbs, unit));
  return withUnit ? `${s} ${unit}` : s;
}
