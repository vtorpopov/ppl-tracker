import type { Exercise, Settings, Template, TemplateItem } from './schema';

type Row = [name: string, muscle: string, equipment: string, type: Exercise['type'], region: Exercise['region']];

// Explicit ids so the starter templates can reference exercises directly.
const rows: Row[] = [
  // Chest
  ['Barbell Bench Press', 'Chest', 'Barbell', 'strength', 'upper'],
  ['Incline Barbell Bench Press', 'Chest', 'Barbell', 'strength', 'upper'],
  ['Dumbbell Bench Press', 'Chest', 'Dumbbell', 'strength', 'upper'],
  ['Incline Dumbbell Press', 'Chest', 'Dumbbell', 'strength', 'upper'],
  ['Machine Chest Press', 'Chest', 'Machine', 'strength', 'upper'],
  ['Cable Fly', 'Chest', 'Cable', 'strength', 'upper'],
  ['Pec Deck', 'Chest', 'Machine', 'strength', 'upper'],
  ['Dips', 'Chest', 'Bodyweight', 'bodyweight', 'upper'],
  ['Push-Up', 'Chest', 'Bodyweight', 'bodyweight', 'upper'],
  // Shoulders
  ['Overhead Press', 'Shoulders', 'Barbell', 'strength', 'upper'],
  ['Seated Dumbbell Shoulder Press', 'Shoulders', 'Dumbbell', 'strength', 'upper'],
  ['Lateral Raise', 'Shoulders', 'Dumbbell', 'strength', 'upper'],
  ['Cable Lateral Raise', 'Shoulders', 'Cable', 'strength', 'upper'],
  ['Rear Delt Fly', 'Shoulders', 'Dumbbell', 'strength', 'upper'],
  ['Face Pull', 'Shoulders', 'Cable', 'strength', 'upper'],
  // Triceps
  ['Triceps Pushdown', 'Triceps', 'Cable', 'strength', 'upper'],
  ['Overhead Triceps Extension', 'Triceps', 'Cable', 'strength', 'upper'],
  ['Skull Crusher', 'Triceps', 'EZ Bar', 'strength', 'upper'],
  ['Close-Grip Bench Press', 'Triceps', 'Barbell', 'strength', 'upper'],
  // Back
  ['Deadlift', 'Back', 'Barbell', 'strength', 'lower'],
  ['Pull-Up', 'Back', 'Bodyweight', 'bodyweight', 'upper'],
  ['Chin-Up', 'Back', 'Bodyweight', 'bodyweight', 'upper'],
  ['Lat Pulldown', 'Back', 'Cable', 'strength', 'upper'],
  ['Barbell Row', 'Back', 'Barbell', 'strength', 'upper'],
  ['Seated Cable Row', 'Back', 'Cable', 'strength', 'upper'],
  ['Chest-Supported Dumbbell Row', 'Back', 'Dumbbell', 'strength', 'upper'],
  ['One-Arm Dumbbell Row', 'Back', 'Dumbbell', 'strength', 'upper'],
  ['T-Bar Row', 'Back', 'Machine', 'strength', 'upper'],
  ['Straight-Arm Pulldown', 'Back', 'Cable', 'strength', 'upper'],
  // Biceps
  ['Barbell Curl', 'Biceps', 'Barbell', 'strength', 'upper'],
  ['Hammer Curl', 'Biceps', 'Dumbbell', 'strength', 'upper'],
  ['Incline Dumbbell Curl', 'Biceps', 'Dumbbell', 'strength', 'upper'],
  ['Cable Curl', 'Biceps', 'Cable', 'strength', 'upper'],
  ['Preacher Curl', 'Biceps', 'EZ Bar', 'strength', 'upper'],
  // Legs
  ['Back Squat', 'Quads', 'Barbell', 'strength', 'lower'],
  ['Front Squat', 'Quads', 'Barbell', 'strength', 'lower'],
  ['Hack Squat', 'Quads', 'Machine', 'strength', 'lower'],
  ['Leg Press', 'Quads', 'Machine', 'strength', 'lower'],
  ['Bulgarian Split Squat', 'Quads', 'Dumbbell', 'strength', 'lower'],
  ['Leg Extension', 'Quads', 'Machine', 'strength', 'lower'],
  ['Romanian Deadlift', 'Hamstrings', 'Barbell', 'strength', 'lower'],
  ['Lying Leg Curl', 'Hamstrings', 'Machine', 'strength', 'lower'],
  ['Seated Leg Curl', 'Hamstrings', 'Machine', 'strength', 'lower'],
  ['Hip Thrust', 'Glutes', 'Barbell', 'strength', 'lower'],
  ['Standing Calf Raise', 'Calves', 'Machine', 'strength', 'lower'],
  ['Seated Calf Raise', 'Calves', 'Machine', 'strength', 'lower'],
  // Core
  ['Hanging Leg Raise', 'Core', 'Bodyweight', 'bodyweight', 'core'],
  ['Cable Crunch', 'Core', 'Cable', 'strength', 'core'],
  ['Ab Wheel Rollout', 'Core', 'Bodyweight', 'bodyweight', 'core'],
  // Cardio
  ['Treadmill', 'Cardio', 'Machine', 'cardio', 'lower'],
  ['Outdoor Run', 'Cardio', 'None', 'cardio', 'lower'],
  ['Stationary Bike', 'Cardio', 'Machine', 'cardio', 'lower'],
  ['Rowing Machine', 'Cardio', 'Machine', 'cardio', 'lower'],
  ['Stair Climber', 'Cardio', 'Machine', 'cardio', 'lower'],
  ['Walk', 'Cardio', 'None', 'cardio', 'lower'],
];

export const seedExercises: Exercise[] = rows.map(([name, muscle, equipment, type, region], i) => ({
  id: i + 1,
  name,
  muscle,
  equipment,
  type,
  region,
}));

const idOf = (name: string): number => {
  const ex = seedExercises.find((e) => e.name === name);
  if (!ex) throw new Error(`Unknown seed exercise: ${name}`);
  return ex.id!;
};

/** [exercise, sets, repMin, repMax, restSec] */
type ItemRow = [string, number, number, number, number];
const items = (list: ItemRow[]): TemplateItem[] =>
  list.map(([name, sets, repMin, repMax, restSec]) => ({ exerciseId: idOf(name), sets, repMin, repMax, restSec }));

export const seedTemplates: Template[] = [
  {
    id: 1,
    name: 'Push A',
    category: 'push',
    items: items([
      ['Barbell Bench Press', 4, 5, 8, 180],
      ['Overhead Press', 3, 6, 10, 150],
      ['Incline Dumbbell Press', 3, 8, 12, 120],
      ['Lateral Raise', 3, 12, 15, 60],
      ['Triceps Pushdown', 3, 10, 15, 60],
      ['Overhead Triceps Extension', 3, 10, 15, 60],
    ]),
  },
  {
    id: 2,
    name: 'Pull A',
    category: 'pull',
    items: items([
      ['Deadlift', 3, 3, 5, 180],
      ['Pull-Up', 3, 6, 10, 150],
      ['Barbell Row', 3, 6, 10, 120],
      ['Face Pull', 3, 12, 15, 60],
      ['Barbell Curl', 3, 8, 12, 90],
      ['Hammer Curl', 3, 10, 12, 60],
    ]),
  },
  {
    id: 3,
    name: 'Legs A',
    category: 'legs',
    items: items([
      ['Back Squat', 4, 5, 8, 180],
      ['Romanian Deadlift', 3, 8, 10, 150],
      ['Leg Press', 3, 10, 12, 120],
      ['Lying Leg Curl', 3, 10, 15, 90],
      ['Standing Calf Raise', 4, 10, 15, 60],
      ['Hanging Leg Raise', 3, 10, 15, 60],
    ]),
  },
  {
    id: 4,
    name: 'Push B',
    category: 'push',
    items: items([
      ['Incline Barbell Bench Press', 4, 6, 10, 150],
      ['Seated Dumbbell Shoulder Press', 3, 8, 12, 120],
      ['Dips', 3, 8, 12, 120],
      ['Cable Fly', 3, 12, 15, 60],
      ['Cable Lateral Raise', 4, 12, 20, 60],
      ['Skull Crusher', 3, 10, 12, 90],
    ]),
  },
  {
    id: 5,
    name: 'Pull B',
    category: 'pull',
    items: items([
      ['Lat Pulldown', 4, 8, 12, 120],
      ['Seated Cable Row', 3, 8, 12, 120],
      ['Chest-Supported Dumbbell Row', 3, 10, 12, 90],
      ['Rear Delt Fly', 3, 12, 20, 60],
      ['Incline Dumbbell Curl', 3, 10, 12, 60],
      ['Cable Curl', 3, 12, 15, 60],
    ]),
  },
  {
    id: 6,
    name: 'Legs B',
    category: 'legs',
    items: items([
      ['Hack Squat', 4, 6, 10, 150],
      ['Hip Thrust', 3, 8, 12, 120],
      ['Bulgarian Split Squat', 3, 8, 12, 90],
      ['Leg Extension', 3, 12, 15, 60],
      ['Seated Leg Curl', 3, 10, 15, 60],
      ['Seated Calf Raise', 4, 12, 20, 60],
    ]),
  },
  {
    id: 7,
    name: 'Cardio',
    category: 'other',
    items: items([['Treadmill', 1, 0, 0, 0]]),
  },
  {
    id: 8,
    name: 'Core',
    category: 'other',
    items: items([
      ['Hanging Leg Raise', 3, 10, 15, 60],
      ['Cable Crunch', 3, 12, 15, 60],
      ['Ab Wheel Rollout', 3, 8, 12, 60],
    ]),
  },
];

export const defaultSettings: Settings = {
  id: 'main',
  unit: 'lbs',
  restSec: 120,
  barLbs: 45,
  barKg: 20,
  platesLbs: [45, 35, 25, 10, 5, 2.5],
  platesKg: [25, 20, 15, 10, 5, 2.5, 1.25],
  rotation: [1, 2, 3, 4, 5, 6],
  nextIndex: 0,
};
