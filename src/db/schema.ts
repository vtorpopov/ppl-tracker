import Dexie, { type Table } from 'dexie';
import { seedExercises, seedTemplates, defaultSettings } from './seed';

export type Category = 'push' | 'pull' | 'legs' | 'other';
export type ExerciseType = 'strength' | 'bodyweight' | 'cardio' | 'timed';
export type Region = 'upper' | 'lower' | 'core';
export type Unit = 'lbs' | 'kg';
export type SwapMode = 'ask' | 'workout' | 'plan';

export interface Exercise {
  id?: number;
  name: string;
  muscle: string;
  equipment: string;
  type: ExerciseType;
  region: Region;
}

export interface TemplateItem {
  exerciseId: number;
  sets: number;
  repMin: number;
  repMax: number;
  restSec: number;
}

export interface Template {
  id?: number;
  name: string;
  category: Category;
  items: TemplateItem[];
}

/** One logged set. Weight is always stored in pounds; the UI converts for kg. */
export interface SetEntry {
  weight: number;
  reps: number;
  rpe: number | null;
  warmup: boolean;
  done: boolean;
  /** Cardio only. */
  minutes?: number;
  /** Cardio only, in miles. */
  distance?: number;
  /** Timed exercises only (plank, carries, hangs). */
  seconds?: number;
}

export interface SessionExercise {
  exerciseId: number;
  repMin: number;
  repMax: number;
  restSec: number;
  sets: SetEntry[];
}

export interface Session {
  id?: number;
  templateId: number | null;
  name: string;
  category: Category;
  startedAt: number;
  /** null while the workout is still in progress. */
  endedAt: number | null;
  notes: string;
  exercises: SessionExercise[];
}

export interface BodyWeight {
  id?: number;
  date: number;
  lbs: number;
}

export interface Settings {
  id: 'main';
  unit: Unit;
  restSec: number;
  barLbs: number;
  barKg: number;
  platesLbs: number[];
  platesKg: number[];
  /** Template ids in rotation order. */
  rotation: number[];
  /** Index into `rotation` of the next workout. */
  nextIndex: number;
  /** What a mid-workout swap does to the saved plan. Missing means 'ask'. */
  swapMode?: SwapMode;
}

export class PplDb extends Dexie {
  exercises!: Table<Exercise, number>;
  templates!: Table<Template, number>;
  sessions!: Table<Session, number>;
  bodyWeight!: Table<BodyWeight, number>;
  settings!: Table<Settings, string>;

  constructor(name = 'ppl-tracker') {
    super(name);
    this.version(1).stores({
      exercises: '++id, name',
      templates: '++id, category',
      sessions: '++id, startedAt, endedAt, templateId',
      bodyWeight: '++id, date',
      settings: 'id',
    });
    // v2 adds ~60 built-in exercises. Only exercises missing by name are
    // inserted, without fixed ids, so custom exercises and history stay put.
    this.version(2).stores({}).upgrade((tx) => addMissingBuiltIns(tx.table('exercises')));
    this.on('populate', (tx) => {
      tx.table('exercises').bulkAdd(seedExercises);
      tx.table('templates').bulkAdd(seedTemplates);
      tx.table('settings').add(defaultSettings);
    });
  }
}

/** Inserts built-in exercises whose names aren't already present. */
export async function addMissingBuiltIns(table: Table<Exercise, number>): Promise<number> {
  const have = new Set((await table.toArray()).map((e) => e.name.trim().toLowerCase()));
  const missing = seedExercises
    .filter((e) => !have.has(e.name.toLowerCase()))
    .map(({ id: _id, ...rest }) => rest);
  if (missing.length) await table.bulkAdd(missing);
  return missing.length;
}

export const db = new PplDb();
