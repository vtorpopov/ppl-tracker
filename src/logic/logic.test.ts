import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { afterComplete, afterSkip, nextTemplateId } from './rotation';
import { nextWeightHint, increment } from './progression';
import { calcPlates } from './plates';
import { fromDisplay, fmtWeight, toDisplay, LBS_PER_KG } from './units';
import { e1rm, lastSetsFor, progressFor, sessionVolume } from './stats';
import { exportData, importData } from './backup';
import Dexie from 'dexie';
import { PplDb, type Exercise, type SetEntry, type Session } from '../db/schema';
import { exerciseMeta, similarExercises } from './similar';
import { tutorialFor } from '../data/guide';
import { seedExercises, seedTemplates, defaultSettings } from '../db/seed';

const rot = [1, 2, 3, 4, 5, 6];
const set = (weight: number, reps: number, extra: Partial<SetEntry> = {}): SetEntry => ({
  weight, reps, rpe: null, warmup: false, done: true, ...extra,
});

describe('rotation', () => {
  it('cycles Push A → Pull A → … → Legs B → Push A', () => {
    let i = 0;
    const seen: number[] = [];
    for (let n = 0; n < 7; n++) {
      const id = nextTemplateId(rot, i)!;
      seen.push(id);
      i = afterComplete(rot, i, id);
    }
    expect(seen).toEqual([1, 2, 3, 4, 5, 6, 1]);
  });
  it('skip moves forward and wraps', () => {
    expect(afterSkip(rot, 0)).toBe(1);
    expect(afterSkip(rot, 5)).toBe(0);
  });
  it('doing a different rotation workout continues after it', () => {
    expect(afterComplete(rot, 1, 6)).toBe(0); // did Legs B instead of Pull A
  });
  it('workouts outside the rotation do not advance it', () => {
    expect(afterComplete(rot, 2, 7)).toBe(2);
    expect(afterComplete(rot, 2, null)).toBe(2);
  });
  it('handles empty rotation and shrunk rotation', () => {
    expect(nextTemplateId([], 0)).toBeNull();
    expect(nextTemplateId([1, 2], 5)).toBe(2);
  });
});

describe('next-weight hint', () => {
  it('increases when every working set hit the top of the range at RPE ≤ 8', () => {
    const h = nextWeightHint([set(95, 5, { warmup: true }), set(135, 8, { rpe: 8 }), set(135, 8)], 8, 'upper', 'lbs');
    expect(h).toEqual({ kind: 'increase', weight: 140 });
  });
  it('lower body jumps by 10 lbs', () => {
    expect(nextWeightHint([set(225, 8)], 8, 'lower', 'lbs')!.weight).toBe(235);
  });
  it('repeats when a set missed reps or was too hard', () => {
    expect(nextWeightHint([set(135, 8), set(135, 6)], 8, 'upper', 'lbs')).toEqual({ kind: 'repeat', weight: 135 });
    expect(nextWeightHint([set(135, 8, { rpe: 9.5 })], 8, 'upper', 'lbs')!.kind).toBe('repeat');
  });
  it('ignores warm-ups and returns null with no data', () => {
    expect(nextWeightHint([set(95, 10, { warmup: true })], 8, 'upper', 'lbs')).toBeNull();
    expect(nextWeightHint([], 8, 'upper', 'lbs')).toBeNull();
  });
  it('uses 2.5 / 5 kg jumps in kg mode', () => {
    expect(toDisplay(increment('upper', 'kg'), 'kg')).toBeCloseTo(2.5);
    expect(toDisplay(increment('lower', 'kg'), 'kg')).toBeCloseTo(5);
  });
});

describe('plate calculator', () => {
  it('loads 225 lbs as two 45s per side', () => {
    expect(calcPlates(225, 45, [45, 35, 25, 10, 5, 2.5])).toEqual({ perSide: [45, 45], loaded: 225, exact: true });
  });
  it('loads 185 lbs as 45 + 25 per side', () => {
    expect(calcPlates(185, 45, [45, 35, 25, 10, 5, 2.5]).perSide).toEqual([45, 25]);
  });
  it('flags weights that cannot be loaded exactly', () => {
    const r = calcPlates(136, 45, [45, 35, 25, 10, 5, 2.5]);
    expect(r.exact).toBe(false);
    expect(r.loaded).toBe(135);
  });
  it('works in kg', () => {
    expect(calcPlates(102.5, 20, [25, 20, 15, 10, 5, 2.5, 1.25]).perSide).toEqual([25, 15, 1.25]);
  });
});

describe('units', () => {
  it('round-trips kg without drift', () => {
    const stored = fromDisplay(100, 'kg');
    expect(stored).toBeCloseTo(100 * LBS_PER_KG);
    expect(fmtWeight(stored, 'kg')).toBe('100');
    expect(fmtWeight(stored + fromDisplay(2.5, 'kg'), 'kg')).toBe('102.5');
  });
  it('formats lbs', () => {
    expect(fmtWeight(135, 'lbs', true)).toBe('135 lbs');
    expect(fmtWeight(137.5, 'lbs')).toBe('137.5');
  });
});

describe('stats', () => {
  const mk = (id: number, day: number, sets: SetEntry[], ended = true): Session => ({
    id, templateId: 1, name: 'Push A', category: 'push', startedAt: day * 86400000,
    endedAt: ended ? day * 86400000 + 1 : null, notes: '',
    exercises: [{ exerciseId: 1, repMin: 5, repMax: 8, restSec: 120, sets }],
  });
  it('e1RM uses Epley', () => {
    expect(e1rm(100, 1)).toBe(100);
    expect(e1rm(100, 10)).toBeCloseTo(133.33, 1);
  });
  it('last sets come from the most recent finished session', () => {
    const sessions = [mk(1, 1, [set(100, 8)]), mk(2, 3, [set(110, 8)]), mk(3, 5, [set(120, 8)], false)];
    expect(lastSetsFor(sessions, 1)[0].weight).toBe(110);
    expect(lastSetsFor(sessions, 1, 2)[0].weight).toBe(100);
  });
  it('timed holds do not count toward volume or strength progress', () => {
    const hold = { ...mk(9, 4, [{ weight: 25, reps: 0, seconds: 60, rpe: null, warmup: false, done: true }]) };
    expect(sessionVolume(hold)).toBe(0);
    expect(progressFor([hold], 1)).toEqual([]);
  });
  it('progress excludes warm-ups and unfinished sessions', () => {
    const sessions = [mk(1, 2, [set(200, 3, { warmup: true }), set(100, 8)]), mk(2, 1, [set(90, 8)])];
    const p = progressFor(sessions, 1);
    expect(p.map((x) => x.top)).toEqual([90, 100]);
  });
});

describe('backup', () => {
  it('export → import round-trips and switching units never changes stored data', async () => {
    const a = new PplDb('test-a');
    await a.open();
    await a.sessions.add({
      templateId: 1, name: 'Push A', category: 'push', startedAt: 1, endedAt: 2, notes: 'hi',
      exercises: [{ exerciseId: 1, repMin: 5, repMax: 8, restSec: 120, sets: [set(135, 8)] }],
    });
    await a.settings.update('main', { unit: 'kg' });
    await a.settings.update('main', { unit: 'lbs' });
    const dump = await exportData(a);
    expect(dump.templates.length).toBe(8);
    expect(dump.sessions[0].exercises[0].sets[0].weight).toBe(135);

    const b = new PplDb('test-b');
    await b.open();
    await importData(b, JSON.parse(JSON.stringify(dump)));
    expect(await b.sessions.count()).toBe(1);
    expect((await b.sessions.toArray())[0].notes).toBe('hi');
    await expect(importData(b, { nope: true })).rejects.toThrow();
    expect(await b.sessions.count()).toBe(1);
  });
});

describe('swap suggestions', () => {
  const byName = (n: string) => seedExercises.find((e) => e.name === n)!;
  const names = (target: string, opts = {}) => similarExercises(byName(target), seedExercises, opts).map((s) => s.exercise.name);

  const reasons = (target: string) => similarExercises(byName(target), seedExercises).map((s) => s.reason);

  it('bench press → other chest presses first, never lateral raises', () => {
    const list = names('Barbell Bench Press');
    expect(reasons('Barbell Bench Press').slice(0, 5)).toEqual(Array(5).fill('Same movement'));
    expect(list).toContain('Dumbbell Bench Press');
    expect(list).toContain('Machine Chest Press');
    expect(list).not.toContain('Lateral Raise');
    expect(list).not.toContain('Barbell Bench Press');
  });
  it('overhead press → at least 3 other overhead presses', () => {
    const list = names('Overhead Press').slice(0, 4).sort();
    expect(list).toEqual(['Arnold Press', 'Machine Shoulder Press', 'Pike Push-Up', 'Seated Dumbbell Shoulder Press']);
  });
  it('pull-up → pulldown and chin-up', () => {
    expect(names('Pull-Up').slice(0, 2).sort()).toEqual(['Chin-Up', 'Lat Pulldown']);
  });
  it('back squat → squat patterns first', () => {
    const list = names('Back Squat');
    expect(reasons('Back Squat')).toEqual(Array(6).fill('Same movement'));
    expect(list).toContain('Hack Squat');
    expect(list).toContain('Leg Press');
  });
  it('new exercises get good matches too', () => {
    expect(reasons('Plank').slice(0, 3)).toEqual(Array(3).fill('Same movement'));
    expect(names('Plank').every((n) => byName(n).muscle === 'Core')).toBe(true);
    expect(names('Goblet Squat')).toContain('Back Squat');
    expect(names('Inverted Row').slice(0, 3).every((n) => byName(n).muscle === 'Back')).toBe(true);
    expect(names('Dumbbell Shrug')[0]).toBe('Barbell Shrug');
  });
  it('every built-in strength exercise has swap data', () => {
    const missing = seedExercises.filter((e) => e.type !== 'cardio' && !exerciseMeta(e.name)).map((e) => e.name);
    expect(missing).toEqual([]);
  });
  it('cardio only suggests cardio', () => {
    const list = similarExercises(byName('Treadmill'), seedExercises);
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((s) => s.exercise.type === 'cardio')).toBe(true);
  });
  it('skips exercises already in the workout and labels the reason', () => {
    const r = similarExercises(byName('Barbell Bench Press'), seedExercises, { exclude: [byName('Dumbbell Bench Press').id!] });
    expect(r.map((s) => s.exercise.name)).not.toContain('Dumbbell Bench Press');
    expect(r[0].reason).toBe('Same movement');
  });
  it('previously logged exercises win ties', () => {
    const history = new Set([byName('Push-Up').id!]);
    expect(names('Barbell Bench Press', { history })[0]).toBe('Push-Up');
  });
  it('custom exercises get suggestions by muscle group', () => {
    const custom: Exercise = { id: 999, name: 'Landmine Press', muscle: 'Chest', equipment: 'Barbell', type: 'strength', region: 'upper' };
    const list = similarExercises(custom, [...seedExercises, custom]);
    expect(list.length).toBeGreaterThanOrEqual(3);
    expect(list.every((s) => s.exercise.muscle === 'Chest')).toBe(true);
  });
});

describe('upgrade from the first version', () => {
  it('adds the new built-in exercises without touching existing data', async () => {
    // Recreate a phone that installed v1: the original 55 exercises, a custom
    // exercise that took id 56, a finished workout, and the starter plans.
    const v1 = new Dexie('upgrade-test');
    v1.version(1).stores({
      exercises: '++id, name', templates: '++id, category', sessions: '++id, startedAt, endedAt, templateId',
      bodyWeight: '++id, date', settings: 'id',
    });
    await v1.open();
    await v1.table('exercises').bulkAdd(seedExercises.slice(0, 55));
    await v1.table('exercises').add({ id: 56, name: 'Landmine Press', muscle: 'Shoulders', equipment: 'Barbell', type: 'strength', region: 'upper' });
    // A custom exercise that happens to share a new built-in's name.
    await v1.table('exercises').add({ id: 57, name: 'plank', muscle: 'Core', equipment: 'Bodyweight', type: 'bodyweight', region: 'core' });
    await v1.table('templates').bulkAdd(seedTemplates);
    await v1.table('settings').add({ ...defaultSettings, nextIndex: 3 });
    await v1.table('sessions').add({
      templateId: 1, name: 'Push A', category: 'push', startedAt: 1, endedAt: 2, notes: 'old',
      exercises: [{ exerciseId: 56, repMin: 8, repMax: 12, restSec: 90, sets: [set(65, 10)] }],
    });
    v1.close();

    const db2 = new PplDb('upgrade-test');
    await db2.open();
    const all = await db2.exercises.toArray();
    const names = all.map((e) => e.name.toLowerCase());
    expect(new Set(names).size).toBe(names.length); // no duplicates
    expect(all).toHaveLength(seedExercises.length + 1); // + Landmine Press; "plank" reused
    expect(await db2.exercises.get(56)).toMatchObject({ name: 'Landmine Press' });
    expect(await db2.exercises.get(57)).toMatchObject({ name: 'plank', type: 'bodyweight' });
    expect(names).toContain('goblet squat');
    expect((await db2.sessions.toArray())[0]).toMatchObject({ notes: 'old', exercises: [{ exerciseId: 56 }] });
    expect(await db2.templates.count()).toBe(seedTemplates.length);
    expect((await db2.settings.get('main'))!.nextIndex).toBe(3);
    db2.close();
  });

  it('a fresh install gets every built-in exercise once', async () => {
    const fresh = new PplDb('fresh-install');
    await fresh.open();
    expect(await fresh.exercises.count()).toBe(seedExercises.length);
    fresh.close();
  });
});

describe('tutorials', () => {
  it('every built-in exercise has a complete written guide and a video', () => {
    const problems: string[] = [];
    for (const e of seedExercises) {
      const { guide, video } = tutorialFor(e.name);
      if (!guide) problems.push(`${e.name}: no guide`);
      else {
        for (const k of ['setup', 'steps', 'tips', 'mistakes'] as const) {
          if (guide[k].length < 2 || guide[k].some((line) => line.trim().length < 3)) problems.push(`${e.name}: weak ${k}`);
        }
      }
      if (!video || !/^[\w-]{11}$/.test(video.id)) problems.push(`${e.name}: bad video`);
    }
    expect(problems).toEqual([]);
  });
  it('custom exercises have no built-in tutorial', () => {
    expect(tutorialFor('Landmine Press')).toEqual({ guide: undefined, video: undefined });
  });
});
