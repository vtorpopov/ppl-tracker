import type { Exercise } from '../db/schema';

type Pattern =
  | 'horizontal-press' | 'incline-press' | 'vertical-press' | 'dip' | 'chest-fly'
  | 'lateral-raise' | 'rear-delt' | 'triceps-ext' | 'curl'
  | 'vertical-pull' | 'horizontal-pull' | 'lat-pullover'
  | 'hip-hinge' | 'squat' | 'lunge' | 'knee-extension' | 'knee-flexion' | 'hip-thrust' | 'calf-raise'
  | 'hip-abduction' | 'hip-adduction' | 'shrug' | 'grip' | 'core-rotation'
  | 'core' | 'cardio';

interface Meta { pattern: Pattern; secondary: string[] }

/**
 * Movement pattern and secondary muscles for the built-in exercises, keyed by
 * name so it applies to existing data and backups without a migration.
 * Custom exercises aren't listed and are matched by muscle group alone.
 */
const META: Record<string, Meta> = {
  'Barbell Bench Press': { pattern: 'horizontal-press', secondary: ['Triceps', 'Shoulders'] },
  'Dumbbell Bench Press': { pattern: 'horizontal-press', secondary: ['Triceps', 'Shoulders'] },
  'Machine Chest Press': { pattern: 'horizontal-press', secondary: ['Triceps', 'Shoulders'] },
  'Push-Up': { pattern: 'horizontal-press', secondary: ['Triceps', 'Shoulders', 'Core'] },
  'Close-Grip Bench Press': { pattern: 'horizontal-press', secondary: ['Chest', 'Shoulders'] },
  'Incline Barbell Bench Press': { pattern: 'incline-press', secondary: ['Shoulders', 'Triceps'] },
  'Incline Dumbbell Press': { pattern: 'incline-press', secondary: ['Shoulders', 'Triceps'] },
  'Dips': { pattern: 'dip', secondary: ['Triceps', 'Shoulders'] },
  'Cable Fly': { pattern: 'chest-fly', secondary: ['Shoulders'] },
  'Pec Deck': { pattern: 'chest-fly', secondary: ['Shoulders'] },

  'Overhead Press': { pattern: 'vertical-press', secondary: ['Triceps', 'Core'] },
  'Seated Dumbbell Shoulder Press': { pattern: 'vertical-press', secondary: ['Triceps'] },
  'Lateral Raise': { pattern: 'lateral-raise', secondary: [] },
  'Cable Lateral Raise': { pattern: 'lateral-raise', secondary: [] },
  'Rear Delt Fly': { pattern: 'rear-delt', secondary: ['Back'] },
  'Face Pull': { pattern: 'rear-delt', secondary: ['Back'] },

  'Triceps Pushdown': { pattern: 'triceps-ext', secondary: [] },
  'Overhead Triceps Extension': { pattern: 'triceps-ext', secondary: [] },
  'Skull Crusher': { pattern: 'triceps-ext', secondary: [] },

  'Deadlift': { pattern: 'hip-hinge', secondary: ['Hamstrings', 'Glutes'] },
  'Romanian Deadlift': { pattern: 'hip-hinge', secondary: ['Glutes', 'Back'] },
  'Pull-Up': { pattern: 'vertical-pull', secondary: ['Biceps'] },
  'Chin-Up': { pattern: 'vertical-pull', secondary: ['Biceps'] },
  'Lat Pulldown': { pattern: 'vertical-pull', secondary: ['Biceps'] },
  'Barbell Row': { pattern: 'horizontal-pull', secondary: ['Biceps', 'Shoulders'] },
  'Seated Cable Row': { pattern: 'horizontal-pull', secondary: ['Biceps', 'Shoulders'] },
  'Chest-Supported Dumbbell Row': { pattern: 'horizontal-pull', secondary: ['Biceps', 'Shoulders'] },
  'One-Arm Dumbbell Row': { pattern: 'horizontal-pull', secondary: ['Biceps', 'Shoulders'] },
  'T-Bar Row': { pattern: 'horizontal-pull', secondary: ['Biceps', 'Shoulders'] },
  'Straight-Arm Pulldown': { pattern: 'lat-pullover', secondary: [] },

  'Barbell Curl': { pattern: 'curl', secondary: [] },
  'Hammer Curl': { pattern: 'curl', secondary: [] },
  'Incline Dumbbell Curl': { pattern: 'curl', secondary: [] },
  'Cable Curl': { pattern: 'curl', secondary: [] },
  'Preacher Curl': { pattern: 'curl', secondary: [] },

  'Back Squat': { pattern: 'squat', secondary: ['Glutes'] },
  'Front Squat': { pattern: 'squat', secondary: ['Glutes', 'Core'] },
  'Hack Squat': { pattern: 'squat', secondary: ['Glutes'] },
  'Leg Press': { pattern: 'squat', secondary: ['Glutes'] },
  'Bulgarian Split Squat': { pattern: 'lunge', secondary: ['Glutes'] },
  'Leg Extension': { pattern: 'knee-extension', secondary: [] },
  'Lying Leg Curl': { pattern: 'knee-flexion', secondary: [] },
  'Seated Leg Curl': { pattern: 'knee-flexion', secondary: [] },
  'Hip Thrust': { pattern: 'hip-thrust', secondary: ['Hamstrings'] },
  'Standing Calf Raise': { pattern: 'calf-raise', secondary: [] },
  'Seated Calf Raise': { pattern: 'calf-raise', secondary: [] },

  'Hanging Leg Raise': { pattern: 'core', secondary: [] },
  'Cable Crunch': { pattern: 'core', secondary: [] },
  'Ab Wheel Rollout': { pattern: 'core', secondary: [] },

  // Machines & cables
  'Machine Shoulder Press': { pattern: 'vertical-press', secondary: ['Triceps'] },
  'Incline Machine Press': { pattern: 'incline-press', secondary: ['Shoulders', 'Triceps'] },
  'Smith Machine Bench Press': { pattern: 'horizontal-press', secondary: ['Triceps', 'Shoulders'] },
  'Low-to-High Cable Fly': { pattern: 'chest-fly', secondary: ['Shoulders'] },
  'Reverse Pec Deck': { pattern: 'rear-delt', secondary: ['Back'] },
  'Machine Lateral Raise': { pattern: 'lateral-raise', secondary: [] },
  'Machine Row': { pattern: 'horizontal-pull', secondary: ['Biceps', 'Shoulders'] },
  'Bayesian Cable Curl': { pattern: 'curl', secondary: [] },
  'Cable Triceps Kickback': { pattern: 'triceps-ext', secondary: [] },
  'Pendulum Squat': { pattern: 'squat', secondary: ['Glutes'] },
  'Smith Machine Squat': { pattern: 'squat', secondary: ['Glutes'] },
  'Leg Press Calf Raise': { pattern: 'calf-raise', secondary: [] },
  'Hip Abduction': { pattern: 'hip-abduction', secondary: [] },
  'Hip Adduction': { pattern: 'hip-adduction', secondary: [] },
  'Cable Glute Kickback': { pattern: 'hip-thrust', secondary: ['Hamstrings'] },
  'Cable Pull-Through': { pattern: 'hip-hinge', secondary: ['Hamstrings'] },
  'Back Extension': { pattern: 'hip-hinge', secondary: ['Glutes', 'Back'] },
  'Cable Woodchopper': { pattern: 'core-rotation', secondary: ['Shoulders'] },
  'Pallof Press': { pattern: 'core-rotation', secondary: [] },

  // Dumbbell & home
  'Dumbbell Curl': { pattern: 'curl', secondary: ['Forearms'] },
  'Concentration Curl': { pattern: 'curl', secondary: [] },
  'Arnold Press': { pattern: 'vertical-press', secondary: ['Triceps'] },
  'Dumbbell Fly': { pattern: 'chest-fly', secondary: ['Shoulders'] },
  'Dumbbell Floor Press': { pattern: 'horizontal-press', secondary: ['Triceps', 'Shoulders'] },
  'Dumbbell Pullover': { pattern: 'lat-pullover', secondary: ['Chest', 'Triceps'] },
  'Dumbbell Overhead Triceps Extension': { pattern: 'triceps-ext', secondary: [] },
  'Dumbbell Triceps Kickback': { pattern: 'triceps-ext', secondary: [] },
  'Goblet Squat': { pattern: 'squat', secondary: ['Glutes', 'Core'] },
  'Dumbbell Romanian Deadlift': { pattern: 'hip-hinge', secondary: ['Glutes', 'Back'] },
  'Walking Lunge': { pattern: 'lunge', secondary: ['Glutes'] },
  'Reverse Lunge': { pattern: 'lunge', secondary: ['Glutes'] },
  'Step-Up': { pattern: 'lunge', secondary: ['Glutes'] },
  'Single-Leg Calf Raise': { pattern: 'calf-raise', secondary: [] },
  'Kettlebell Swing': { pattern: 'hip-hinge', secondary: ['Hamstrings', 'Core'] },
  'Barbell Shrug': { pattern: 'shrug', secondary: ['Forearms'] },
  'Dumbbell Shrug': { pattern: 'shrug', secondary: ['Forearms'] },
  'Wrist Curl': { pattern: 'grip', secondary: [] },
  "Farmer's Carry": { pattern: 'grip', secondary: ['Traps', 'Core'] },

  // Bodyweight
  'Incline Push-Up': { pattern: 'horizontal-press', secondary: ['Triceps', 'Shoulders'] },
  'Diamond Push-Up': { pattern: 'horizontal-press', secondary: ['Chest', 'Shoulders'] },
  'Pike Push-Up': { pattern: 'vertical-press', secondary: ['Triceps'] },
  'Bench Dip': { pattern: 'dip', secondary: ['Chest', 'Shoulders'] },
  'Inverted Row': { pattern: 'horizontal-pull', secondary: ['Biceps', 'Shoulders'] },
  'Negative Pull-Up': { pattern: 'vertical-pull', secondary: ['Biceps'] },
  'Bodyweight Squat': { pattern: 'squat', secondary: ['Glutes'] },
  'Glute Bridge': { pattern: 'hip-thrust', secondary: ['Hamstrings'] },
  'Nordic Curl': { pattern: 'knee-flexion', secondary: [] },
  'Hanging Knee Raise': { pattern: 'core', secondary: [] },

  // Core
  'Plank': { pattern: 'core', secondary: ['Shoulders'] },
  'Side Plank': { pattern: 'core', secondary: [] },
  'Hollow Body Hold': { pattern: 'core', secondary: [] },
  'Dead Bug': { pattern: 'core', secondary: [] },
  'Russian Twist': { pattern: 'core-rotation', secondary: [] },
  'Bicycle Crunch': { pattern: 'core', secondary: [] },
  'Dead Hang': { pattern: 'grip', secondary: ['Back'] },
};

/** Pattern and secondary muscles for a built-in exercise, if known. */
export function exerciseMeta(name: string): { pattern: string; secondary: string[] } | undefined {
  return META[name];
}

export type SwapReason = 'Same movement' | 'Same muscle' | 'Similar muscles';

export interface Suggestion {
  exercise: Exercise;
  reason: SwapReason;
}

function metaOf(ex: Exercise): Meta | undefined {
  return ex.type === 'cardio' ? { pattern: 'cardio', secondary: [] } : META[ex.name];
}

function score(a: Exercise, b: Exercise): { score: number; reason: SwapReason } {
  const ma = metaOf(a);
  const mb = metaOf(b);
  const secA = ma?.secondary ?? [];
  const secB = mb?.secondary ?? [];
  const samePattern = !!ma && !!mb && ma.pattern === mb.pattern;
  const sameMuscle = a.muscle === b.muscle;
  let s = 0;
  if (samePattern) s += 10;
  if (sameMuscle) s += 5;
  if (secA.includes(b.muscle) || secB.includes(a.muscle)) s += 2;
  s += secA.filter((m) => secB.includes(m)).length;
  return { score: s, reason: samePattern ? 'Same movement' : sameMuscle ? 'Same muscle' : 'Similar muscles' };
}

/**
 * Replacements for `target` that train the same muscles, closest first.
 * `exclude` is typically the exercises already in the workout; `history`
 * holds exercises the user has logged, used only to break ties.
 */
export function similarExercises(
  target: Exercise,
  all: Exercise[],
  opts: { exclude?: number[]; history?: Set<number>; limit?: number } = {},
): Suggestion[] {
  const { exclude = [], history, limit = 6 } = opts;
  const isCardio = target.type === 'cardio';
  const ranked = all
    .filter((e) => e.id !== target.id && !exclude.includes(e.id!) && (e.type === 'cardio') === isCardio)
    .map((e) => {
      const r = score(target, e);
      return { exercise: e, reason: r.reason, score: r.score + (history?.has(e.id!) ? 0.5 : 0) };
    })
    .filter((r) => r.score >= 1)
    .sort((a, b) => b.score - a.score || a.exercise.name.localeCompare(b.exercise.name));

  const strong = ranked.filter((r) => r.score >= 5);
  const picked = strong.length >= 3 ? strong : ranked;
  return picked.slice(0, limit).map(({ exercise, reason }) => ({ exercise, reason }));
}
