import { useEffect, useState } from 'react';
import type { Exercise } from '../db/schema';
import { tutorialFor } from '../data/guide';
import { exerciseMeta } from '../logic/similar';
import { Sheet } from './ui';

function useOnline(): boolean {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
  }, []);
  return online;
}

function Section({ title, items, numbered }: { title: string; items: string[]; numbered?: boolean }) {
  const List = numbered ? 'ol' : 'ul';
  return (
    <section className="mt-5">
      <h4 className="text-[13px] font-semibold uppercase text-label2 mb-2">{title}</h4>
      <List className="space-y-2">
        {items.map((line, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-snug">
            <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${numbered ? 'bg-accent/20 text-accent' : 'text-label2'}`} aria-hidden>
              {numbered ? i + 1 : '•'}
            </span>
            <span className="pt-0.5">{line}</span>
          </li>
        ))}
      </List>
    </section>
  );
}

/** How-to sheet: embedded video plus written setup, steps, tips and mistakes. */
export function ExerciseGuide({ exercise, onClose }: { exercise: Exercise | null; onClose: () => void }) {
  const online = useOnline();
  const { guide, video } = exercise ? tutorialFor(exercise.name) : {};
  const secondary = exercise ? exerciseMeta(exercise.name)?.secondary ?? [] : [];

  return (
    <Sheet open={exercise != null} title={exercise?.name ?? ''} onClose={onClose}>
      {exercise && (
        <div className="pb-4">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[12px] font-semibold rounded-full px-2.5 py-1 bg-accent/20 text-accent">{exercise.muscle}</span>
            {secondary.map((m) => (
              <span key={m} className="text-[12px] font-semibold rounded-full px-2.5 py-1 bg-card2 text-[#c7c7cc]">{m}</span>
            ))}
            <span className="text-[12px] font-semibold rounded-full px-2.5 py-1 bg-card2 text-label2">{exercise.equipment}</span>
          </div>

          {video && (
            <div className="mt-4">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                {online ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?playsinline=1&rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-card2">
                    <div className="text-[28px]" aria-hidden>📶</div>
                    <div className="font-semibold mt-1">Video needs internet</div>
                    <div className="text-label2 text-[13px] mt-1">The written guide below works offline.</div>
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between gap-3 mt-2">
                <div className="text-label2 text-[13px] leading-snug">{video.title}</div>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-accent text-[13px] font-semibold"
                >
                  Open in YouTube
                </a>
              </div>
            </div>
          )}

          {guide ? (
            <>
              <Section title="Setup" items={guide.setup} />
              <Section title="How to do it" items={guide.steps} numbered />
              <Section title="Form tips" items={guide.tips} />
              <Section title="Common mistakes" items={guide.mistakes} />
            </>
          ) : (
            <p className="text-label2 text-[15px] mt-4">
              There's no built-in guide for custom exercises. Add your own cues in the workout notes.
            </p>
          )}
        </div>
      )}
    </Sheet>
  );
}

/** Small round "i" button that opens a guide. */
export function GuideButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={label}
      className="shrink-0 w-8 h-8 rounded-full bg-card2 text-accent flex items-center justify-center active:opacity-70"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
        <path d="M12 11v7M12 6.5v.01" />
      </svg>
    </button>
  );
}
