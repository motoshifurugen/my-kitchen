/**
 * Hooks Index
 */

export { useReducedMotion, useIsReducedMotion } from './useReducedMotion';
export type { ReducedMotionConfig } from './useReducedMotion';
export { useWorldSignalsUpdater } from './useWorldSignalsUpdater';
export { useGridColumns, getGridColumns } from './useGridColumns';
export {
  useResponsiveLayout,
  getScreenClass,
  getPagePaddingX,
  getGridColumnsFromClass,
  type ScreenClass,
  type ResponsiveLayout,
} from './useResponsiveLayout';
export {
  useCardEntryAnimation,
  getCardEntryAnimationConfig,
  type CardEntryAnimationConfig,
  type UseCardEntryAnimationResult,
} from './useCardEntryAnimation';
export { useLoadingState, type LoadingState } from './useLoadingState';
