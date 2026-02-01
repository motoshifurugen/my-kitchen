/**
 * World Signals Updater Hook
 *
 * Periodically updates time-of-day and season signals based on system time.
 * Updates every 15 minutes for time blending, and daily for season.
 */

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useWorldSignals } from '../state/worldSignals';

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

export const useWorldSignalsUpdater = (): void => {
  const updateFromSystem = useWorldSignals((state) => state.updateFromSystem);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial update
    updateFromSystem();

    // Set up 15-minute interval for time blend updates
    intervalRef.current = setInterval(() => {
      updateFromSystem();
    }, FIFTEEN_MINUTES_MS);

    // Handle app coming to foreground
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        updateFromSystem();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      subscription.remove();
    };
  }, [updateFromSystem]);
};
