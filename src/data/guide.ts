import { PUSH_GUIDES } from './guides-push';
import { PULL_GUIDES } from './guides-pull';
import { LEG_GUIDES } from './guides-legs';
import { CORE_CARDIO_GUIDES } from './guides-core';
import { VIDEOS, type Video } from './videos';

/** Written how-to for one exercise. */
export interface Guide {
  setup: string[];
  steps: string[];
  tips: string[];
  mistakes: string[];
}

const GUIDES: Record<string, Guide> = { ...PUSH_GUIDES, ...PULL_GUIDES, ...LEG_GUIDES, ...CORE_CARDIO_GUIDES };

/** Built-in guide and video for an exercise name; undefined for custom exercises. */
export function tutorialFor(name: string): { guide?: Guide; video?: Video } {
  return { guide: GUIDES[name], video: VIDEOS[name] };
}

export function hasTutorial(name: string): boolean {
  return name in GUIDES || name in VIDEOS;
}
