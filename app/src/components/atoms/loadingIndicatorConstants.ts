/**
 * LoadingIndicator Constants
 *
 * Animation and visual constants for the loading indicator.
 * Exported separately for safe importing in tests.
 *
 * @see docs/ux/phase-1/02-design-system.md §ローディング/待機状態の表現
 */

// Animation spec from design system
export const LOADING_INDICATOR_BREATH_DURATION = 800; // 800ms per cycle
export const LOADING_INDICATOR_OPACITY_MIN = 0.3;
export const LOADING_INDICATOR_OPACITY_MAX = 0.6;
export const LOADING_INDICATOR_DOT_COUNT = 3;

// Dot sizes
export const LOADING_INDICATOR_DOT_SIZE = {
  small: 4,
  medium: 6,
} as const;
