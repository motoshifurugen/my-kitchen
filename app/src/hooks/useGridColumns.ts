/**
 * useGridColumns Hook
 *
 * Returns the number of grid columns based on screen width.
 * Follows responsive breakpoints from accessibility spec.
 */

import { useWindowDimensions } from 'react-native';

// Breakpoints (from 07-accessibility.md)
const BREAKPOINT_COMPACT = 360;
const BREAKPOINT_TABLET = 768;

/**
 * Calculate grid columns based on screen width.
 *
 * - Compact (<360): 2 columns
 * - Regular/Large Phone (360-767): 3 columns
 * - Tablet (>=768): 4 columns
 */
export function getGridColumns(width: number): 2 | 3 | 4 {
  if (width < BREAKPOINT_COMPACT) {
    return 2;
  }
  if (width < BREAKPOINT_TABLET) {
    return 3;
  }
  return 4;
}

/**
 * Hook to get responsive grid columns.
 * Automatically updates when screen dimensions change.
 */
export function useGridColumns(): 2 | 3 | 4 {
  const { width } = useWindowDimensions();
  return getGridColumns(width);
}
