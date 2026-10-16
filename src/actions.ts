import { db, type Exercise, type Session, type SessionExercise, type SetEntry, type Template } from './db/schema';
import { afterComplete, afterSkip } from './logic/rotation';

export function blankSet(ex?: Exercise): SetEntry {
  return ex?.type === 'cardio'
    ? { weight: 0, reps: 0, rpe: null, warmup: false, done: false, minutes: undefined, distance: undefined }
    : { weight: 0, reps: 0, rpe: null, warmup: false, done: false };
}

export function sessionExercise(ex: Exercise, sets: number, repMin: number, repMax: number, restSec: number): SessionExercise {
  return {
    exerciseId: ex.id!,
    repMin,
    repMax,
    restSec,
    sets: Array.from({ length: Math.max(1, sets) }, () => blankSet(ex)),
  };
}

export async function activeSession(): Promise<Session | undefined> {
  return db.sessions.filter((s) => s.endedAt == null).first();
}

/** Starts a workout from a template (or an empty one) and returns its id. */
export async function startWorkout(template: Template | null): Promise<number> {
  const existing = await activeSession();
  if (existing) return existing.id!;
  const exercises = await db.exercises.toArray();
  const byId = new Map(exercises.map((e) => [e.id!, e]));
  const items = template?.items ?? [];
  return db.sessions.add({
    templateId: template?.id ?? null,
    name: template?.name ?? 'Workout',
    category: template?.category ?? 'other',
    startedAt: Date.now(),
    endedAt: null,
    notes: '',
    exercises: items
      .filter((it) => byId.has(it.exerciseId))
      .map((it) => sessionExercise(byId.get(it.exerciseId)!, it.sets, it.repMin, it.repMax, it.restSec)),
  });
}

/** Drops unfinished sets, closes the workout, and advances the rotation. */
export async function finishWorkout(id: number): Promise<void> {
  await db.transaction('rw', db.sessions, db.settings, async () => {
    const s = await db.sessions.get(id);
    if (!s) return;
    const exercises = s.exercises
      .map((e) => ({ ...e, sets: e.sets.filter((x) => x.done) }))
      .filter((e) => e.sets.length > 0);
    await db.sessions.update(id, { exercises, endedAt: Date.now() });
    const st = await db.settings.get('main');
    if (st) await db.settings.update('main', { nextIndex: afterComplete(st.rotation, st.nextIndex, s.templateId) });
  });
}

export async function skipNext(): Promise<void> {
  const st = await db.settings.get('main');
  if (st) await db.settings.update('main', { nextIndex: afterSkip(st.rotation, st.nextIndex) });
}

export async function saveSession(s: Session): Promise<void> {
  await db.sessions.put(s);
}
