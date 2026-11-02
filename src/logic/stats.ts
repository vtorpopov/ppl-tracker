import type { Session, SetEntry } from '../db/schema';

/** Estimated one-rep max (Epley formula). */
export function e1rm(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  return reps === 1 ? weight : weight * (1 + reps / 30);
}

/** Completed, non-warm-up sets with reps (timed holds have none). */
export function workingSets(sets: SetEntry[]): SetEntry[] {
  return sets.filter((s) => s.done && !s.warmup && s.reps > 0);
}

/** Sets from the most recent finished session that did this exercise. */
export function lastSetsFor(sessions: Session[], exerciseId: number, excludeSessionId?: number): SetEntry[] {
  const finished = sessions
    .filter((s) => s.endedAt != null && s.id !== excludeSessionId)
    .sort((a, b) => b.startedAt - a.startedAt);
  for (const s of finished) {
    const ex = s.exercises.find((e) => e.exerciseId === exerciseId && e.sets.some((x) => x.done));
    if (ex) return ex.sets.filter((x) => x.done);
  }
  return [];
}

export interface ProgressPoint {
  date: number;
  top: number;
  e1rm: number;
  volume: number;
}

/** One point per finished session: heaviest working set, best e1RM, total volume (lbs). */
export function progressFor(sessions: Session[], exerciseId: number): ProgressPoint[] {
  const points: ProgressPoint[] = [];
  for (const s of sessions) {
    if (s.endedAt == null) continue;
    const sets = s.exercises.filter((e) => e.exerciseId === exerciseId).flatMap((e) => workingSets(e.sets));
    if (sets.length === 0) continue;
    points.push({
      date: s.startedAt,
      top: Math.max(...sets.map((x) => x.weight)),
      e1rm: Math.max(...sets.map((x) => e1rm(x.weight, x.reps))),
      volume: sets.reduce((a, x) => a + x.weight * x.reps, 0),
    });
  }
  return points.sort((a, b) => a.date - b.date);
}

export function sessionVolume(s: Session): number {
  return s.exercises.flatMap((e) => workingSets(e.sets)).reduce((a, x) => a + x.weight * x.reps, 0);
}
