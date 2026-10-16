import Dexie, { type Table } from 'dexie';
import { seedExercises, seedTemplates, defaultSettings } from './seed';

export type Category = 'push' | 'pull' | 'legs' | 'other';
export type ExerciseType = 'strength' | 'bodyweight' | 'cardio';
export type Region = 'upper' | 'lower' | 'core';
export type Unit = 'lbs' | 'kg';

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
    this.on('populate', (tx) => {
      tx.table('exercises').bulkAdd(seedExercises);
      tx.table('templates').bulkAdd(seedTemplates);
      tx.table('settings').add(defaultSettings);
    });
  }
}

export const db = new PplDb();
