// Static require map for exercise photos. Metro resolves require() at build
// time, so local bundled images must be referenced here by a slug key — set
// `image: '<slug>'` on an exercise in data/workouts.ts to show it.
//
// Only add a key here once the file actually exists in assets/exercises/.

import type { ImageSourcePropType } from 'react-native';

const EXERCISE_IMAGES: Record<string, ImageSourcePropType> = {
  // ── Pull ──────────────────────────────────────────────────────────────────
  'weighted-pull-ups': require('../../assets/exercises/weighted-pull-ups.png'),
  'ring-rows': require('../../assets/exercises/ring-rows.png'),
  'ring-face-pulls': require('../../assets/exercises/ring-face-pulls.png'),
  'ring-curls': require('../../assets/exercises/ring-curls.png'),
  'front-lever-tuck': require('../../assets/exercises/front-lever-tuck.png'),

  // ── Push ──────────────────────────────────────────────────────────────────
  'ring-dips': require('../../assets/exercises/ring-dips.png'),
  'pike-push-ups': require('../../assets/exercises/pike-push-ups.png'),
  'ring-flys': require('../../assets/exercises/ring-flys.png'),
  'pseudo-planche-push-ups': require('../../assets/exercises/pseudo-planche-push-ups.png'),
  'ring-triceps-extensions': require('../../assets/exercises/ring-triceps-extensions.png'),
  'hollow-body-holds': require('../../assets/exercises/hollow-body-holds.png'),

  // ── Core ──────────────────────────────────────────────────────────────────
  'front-lever': require('../../assets/exercises/front-lever.png'),
  'hanging-leg-raises': require('../../assets/exercises/hanging-leg-raises.png'),
  'l-sit': require('../../assets/exercises/l-sit.png'),
  'dragon-flag': require('../../assets/exercises/dragon-flag.png'),
  'ab-wheel': require('../../assets/exercises/ab-wheel.png'),
  'pallof-press': require('../../assets/exercises/pallof-press.png'),
  'calf-raises': require('../../assets/exercises/calf-raises.png'),

  // ── Pull #2 ───────────────────────────────────────────────────────────────
  'muscle-up': require('../../assets/exercises/muscle-up.png'),
  'explosive-pull-ups': require('../../assets/exercises/explosive-pull-ups.png'),
  'wide-grip-pull-ups': require('../../assets/exercises/wide-grip-pull-ups.png'),
  'ring-rows-hard': require('../../assets/exercises/ring-rows-hard.png'),

  // ── Push #2 ───────────────────────────────────────────────────────────────
  'handstand': require('../../assets/exercises/handstand.png'),
  'archer-push-ups': require('../../assets/exercises/archer-push-ups.png'),
  'lateral-raises': require('../../assets/exercises/lateral-raises.png'),
  'planche-lean': require('../../assets/exercises/planche-lean.png'),
  'dragon-flag-negatives': require('../../assets/exercises/dragon-flag-negatives.png'),
};

/** Resolve an exercise image slug to a source, or undefined if unknown/unset. */
export function exerciseImage(slug?: string): ImageSourcePropType | undefined {
  if (!slug) return undefined;
  return EXERCISE_IMAGES[slug];
}

export default EXERCISE_IMAGES;
