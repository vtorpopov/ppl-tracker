import type { Region, SetEntry, Unit } from '../db/schema';
import { LBS_PER_KG } from './units';

export interface Hint {
  kind: 'increase' | 'repeat';
  /** Suggested weight in lbs. */
  weight: number;
}

/** Weight jump, in lbs, for a successful session. */
export function increment(region: Region, unit: Unit): number {
  const lower = region === 'lower';
  return unit === 'kg' ? (lower ? 5 : 2.5) * LBS_PER_KG : lower ? 10 : 5;
}

/**
 * Progressive-overload hint from the previous session's sets: if every
 * completed working set reached the top of the rep range at RPE 8 or
 * easier, add weight; otherwise repeat the heaviest working weight.
 */
export function nextWeightHint(lastSets: SetEntry[], repMax: number, region: Region, unit: Unit): Hint | null {
  const working = lastSets.filter((s) => s.done && !s.warmup);
  if (working.length === 0) return null;
  const top = Math.max(...working.map((s) => s.weight));
  if (top <= 0) return null;
  const hitAll = working.every((s) => s.reps >= repMax && (s.rpe == null || s.rpe <= 8));
  return hitAll ? { kind: 'increase', weight: top + increment(region, unit) } : { kind: 'repeat', weight: top };
}
