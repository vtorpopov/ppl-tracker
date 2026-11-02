import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Exercise } from '../db/schema';
import { similarExercises, type SwapReason } from '../logic/similar';
import { ExercisePicker } from './ExercisePicker';
import { Chevron, Sheet } from './ui';

const reasonStyle: Record<SwapReason, string> = {
  'Same movement': 'bg-[#30d158]/15 text-[#30d158]',
  'Same muscle': 'bg-accent/15 text-accent',
  'Similar muscles': 'bg-card2 text-label2',
};

/** Suggests replacements for an exercise, with the full library one tap deeper. */
export function SwapSheet({ target, exclude, history, onClose, onPick }: {
  target: Exercise | null; exclude: number[]; history: Set<number>; onClose: () => void; onPick: (ex: Exercise) => void;
}) {
  const all = useLiveQuery(() => db.exercises.toArray(), []) ?? [];
  const [browsing, setBrowsing] = useState(false);
  const suggestions = target ? similarExercises(target, all, { exclude, history }) : [];

  const close = () => { setBrowsing(false); onClose(); };
  const pick = (ex: Exercise) => { setBrowsing(false); onPick(ex); };

  return (
    <>
      <Sheet open={target != null && !browsing} title={target ? `Swap ${target.name}` : ''} onClose={close}>
        <div className="text-label2 text-[13px] font-semibold uppercase px-1 mb-2">Suggested</div>
        {suggestions.length > 0 ? (
          <div className="bg-card2/50 rounded-2xl overflow-hidden">
            {suggestions.map(({ exercise, reason }) => (
              <button
                key={exercise.id}
                type="button"
                onClick={() => pick(exercise)}
                className="w-full flex items-center gap-3 text-left px-4 py-3 border-b border-sep/60 last:border-b-0 active:bg-card2"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium leading-snug">{exercise.name}</div>
                  <div className="text-label2 text-[13px]">
                    {exercise.muscle} · {exercise.equipment}
                    {history.has(exercise.id!) && ' · done before'}
                  </div>
                </div>
                <span className={`shrink-0 text-[11px] font-semibold rounded-full px-2 py-0.5 ${reasonStyle[reason]}`}>{reason}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-label2 text-[15px] px-1 py-3">No close matches. Browse the full library below.</div>
        )}
        <button
          type="button"
          onClick={() => setBrowsing(true)}
          className="w-full flex items-center justify-between bg-card2 rounded-xl px-4 py-3 mt-4 font-semibold active:opacity-70"
        >
          Browse all exercises
          <Chevron />
        </button>
      </Sheet>
      <ExercisePicker open={target != null && browsing} title="All Exercises" onClose={close} onPick={pick} />
    </>
  );
}
