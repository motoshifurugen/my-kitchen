/**
 * useResponsiveLayout Hook
 *
 * Returns responsive layout values based on screen width.
 * Implements breakpoints from docs/ux/phase-1/07-accessibility.md §12
 *
 * @see docs/ux/phase-1/07-accessibility.md §12. レスポンシブレイアウト
 */

import { useWindowDimensions } from 'react-native';

// Breakpoints (from 07-accessibility.md §12)
const BREAKPOINT_COMPACT = 360;
const BREAKPOINT_REGULAR_MAX = 430;
const BREAKPOINT_LARGE_PHONE_MAX = 768;

// Content max width for Tablet
const CONTENT_MAX_WIDTH = 560;

export type ScreenClass = 'compact' | 'regular' | 'largePhone' | 'tablet';

export interface ResponsiveLayout {
  /** Screen class based on width */
  screenClass: ScreenClass;
  /** Horizontal padding for page content */
  pagePaddingX: number;
  /** Maximum content width (for Tablet) */
  contentMaxWidth: number;
  /** Number of grid columns */
  gridColumns: 2 | 3 | 4;
  /** Whether to center content (Tablet only) */
  shouldCenterContent: boolean;
}

/**
 * Get screen class based on width
 */
export function getScreenClass(width: number): ScreenClass {
  if (width < BREAKPOINT_COMPACT) {
    return 'compact';
  }
  if (width < BREAKPOINT_REGULAR_MAX) {
    return 'regular';
  }
  if (width < BREAKPOINT_LARGE_PHONE_MAX) {
    return 'largePhone';
  }
  return 'tablet';
}

/**
 * Get page padding X based on screen class
 */
export function getPagePaddingX(screenClass: ScreenClass): number {
  switch (screenClass) {
    case 'compact':
      return 16; // spacing.md
    case 'regular':
      return 20; // spacing.screen.horizontal
    case 'largePhone':
      return 24; // spacing.lg
    case 'tablet':
      return 32; // spacing.xl
  }
}

/**
 * Get grid columns based on screen class
 */
export function getGridColumnsFromClass(screenClass: ScreenClass): 2 | 3 | 4 {
  switch (screenClass) {
    case 'compact':
      return 2;
    case 'regular':
    case 'largePhone':
      return 3;
    case 'tablet':
      return 4;
  }
}

/**
 * Hook to get responsive layout values.
 * Automatically updates when screen dimensions change.
 */
export function useResponsiveLayout(): ResponsiveLayout {
  const { width } = useWindowDimensions();
  const screenClass = getScreenClass(width);
  const pagePaddingX = getPagePaddingX(screenClass);
  const gridColumns = getGridColumnsFromClass(screenClass);
  const shouldCenterContent = screenClass === 'tablet';

  return {
    screenClass,
    pagePaddingX,
    contentMaxWidth: CONTENT_MAX_WIDTH,
    gridColumns,
    shouldCenterContent,
  };
}

