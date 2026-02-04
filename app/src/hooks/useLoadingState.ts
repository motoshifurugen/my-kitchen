/**
 * useLoadingState Hook
 *
 * Tracks elapsed loading time and returns which UI state to show.
 * Follows design spec thresholds:
 * - < 200ms: show nothing
 * - 200-900ms: show mini indicator
 * - > 900ms: show skeleton
 * - > 3000ms: show skeleton + message
 *
 * Uses targeted setTimeout chains instead of continuous polling
 * for better performance (3 state updates instead of ~60).
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// Thresholds from docs/ux/phase-1/02-design-system.md
const INDICATOR_THRESHOLD = 200;
const SKELETON_THRESHOLD = 900;
const MESSAGE_THRESHOLD = 3000;

type LoadingPhase = 'nothing' | 'indicator' | 'skeleton' | 'message';

export interface LoadingState {
  /** True when loading < 200ms (show nothing) */
  showNothing: boolean;
  /** True when loading 200-900ms (show mini indicator) */
  showIndicator: boolean;
  /** True when loading > 900ms (show skeleton) */
  showSkeleton: boolean;
  /** True when loading > 3000ms (show message) */
  showMessage: boolean;
}

/**
 * Hook to determine which loading UI to show based on elapsed time.
 *
 * @param isLoading - Whether loading is in progress
 * @returns LoadingState object with boolean flags for each threshold
 */
export function useLoadingState(isLoading: boolean): LoadingState {
  const [phase, setPhase] = useState<LoadingPhase>('nothing');
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    if (isLoading) {
      // Reset to initial phase
      setPhase('nothing');

      // Schedule phase transitions at exact thresholds
      const indicatorTimer = setTimeout(() => {
        setPhase('indicator');
      }, INDICATOR_THRESHOLD);

      const skeletonTimer = setTimeout(() => {
        setPhase('skeleton');
      }, SKELETON_THRESHOLD);

      const messageTimer = setTimeout(() => {
        setPhase('message');
      }, MESSAGE_THRESHOLD);

      timersRef.current = [indicatorTimer, skeletonTimer, messageTimer];
    } else {
      // Reset when loading stops
      clearTimers();
      setPhase('nothing');
    }

    return clearTimers;
  }, [isLoading, clearTimers]);

  // Not loading = all false
  if (!isLoading) {
    return {
      showNothing: false,
      showIndicator: false,
      showSkeleton: false,
      showMessage: false,
    };
  }

  // Determine state based on current phase
  return {
    showNothing: phase === 'nothing',
    showIndicator: phase === 'indicator',
    showSkeleton: phase === 'skeleton' || phase === 'message',
    showMessage: phase === 'message',
  };
}
