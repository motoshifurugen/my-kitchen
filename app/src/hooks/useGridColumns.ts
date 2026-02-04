/**
 * useGridColumns Hook
 *
 * Returns the number of grid columns based on screen width.
 * Follows responsive breakpoints from accessibility spec.
 *
 * @deprecated Use useResponsiveLayout() instead for comprehensive responsive values.
 * This hook is kept for backward compatibility.
 */

import { useWindowDimensions } from 'react-native';
import { getGridColumnsFromClass, getScreenClass } from './useResponsiveLayout';

/**
 * Calculate grid columns based on screen width.
 *
 * - Compact (<360): 2 columns
 * - Regular (360-429): 3 columns
 * - Large Phone (430-767): 3 columns
 * - Tablet (>=768): 4 columns
 *
 * @deprecated Use getGridColumnsFromClass(getScreenClass(width)) instead
 */
export function getGridColumns(width: number): 2 | 3 | 4 {
  const screenClass = getScreenClass(width);
  return getGridColumnsFromClass(screenClass);
}

/**
 * Hook to get responsive grid columns.
 * Automatically updates when screen dimensions change.
 *
 * @deprecated Use useResponsiveLayout() instead
 */
export function useGridColumns(): 2 | 3 | 4 {
  const { width } = useWindowDimensions();
  return getGridColumns(width);
}
