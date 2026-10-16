import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Exercise, type Settings } from './db/schema';

export function useSettings(): Settings | undefined {
  return useLiveQuery(() => db.settings.get('main'));
}

export function useExerciseMap(): Map<number, Exercise> {
  const list = useLiveQuery(() => db.exercises.toArray(), []) ?? [];
  return new Map(list.map((e) => [e.id!, e]));
}

export function useTemplates() {
  return useLiveQuery(() => db.templates.toArray(), []) ?? [];
}
