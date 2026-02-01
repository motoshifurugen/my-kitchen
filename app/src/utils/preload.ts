/**
 * Asset Preloader
 *
 * Handles preloading of world assets:
 * - Critical: Base kitchen + current time/season overlays (blocking)
 * - Secondary: Props based on user settings (lazy)
 * - Ambient: Animation assets (lazy)
 */

import { Asset } from 'expo-asset';
import { Image, ImageSourcePropType } from 'react-native';
import {
  getCriticalAssets,
  getSecondaryAssets,
  getAmbientAssets,
} from '../assets/manifest';
import { TimeOfDay, Season, AgeGroup, HouseholdType } from '../state/worldSignals';

// ============================================================================
// Types
// ============================================================================

export interface PreloadProgress {
  critical: boolean;
  secondary: boolean;
  ambient: boolean;
}

export interface PreloadConfig {
  timeOfDay: TimeOfDay;
  season: Season;
  ageGroup: AgeGroup;
  householdType: HouseholdType;
}

// ============================================================================
// Preload Functions
// ============================================================================

/**
 * Preload a single image asset
 * Uses expo-asset for bundled assets, or Image.prefetch for remote URLs
 */
const preloadImage = async (source: ImageSourcePropType): Promise<void> => {
  if (typeof source === 'number') {
    // Bundled asset (require result)
    await Asset.loadAsync(source);
  } else if (typeof source === 'object' && 'uri' in source && source.uri) {
    // Remote or data URI
    if (source.uri.startsWith('data:')) {
      // Data URIs don't need preloading
      return;
    }
    await Image.prefetch(source.uri);
  }
};

/**
 * Preload multiple assets in parallel
 */
const preloadImages = async (sources: ImageSourcePropType[]): Promise<void> => {
  await Promise.all(sources.map(preloadImage));
};

/**
 * Preload critical assets (base + current time/season)
 * This should complete before showing the world
 */
export const preloadCriticalAssets = async (
  timeOfDay: TimeOfDay,
  season: Season
): Promise<void> => {
  const assets = getCriticalAssets(timeOfDay, season);
  await preloadImages(assets);
};

/**
 * Preload secondary assets (props)
 * Can happen after initial render
 */
export const preloadSecondaryAssets = async (
  ageGroup: AgeGroup,
  householdType: HouseholdType
): Promise<void> => {
  const assets = getSecondaryAssets(ageGroup, householdType);
  await preloadImages(assets);
};

/**
 * Preload ambient assets
 * Can happen after initial render
 */
export const preloadAmbientAssets = async (): Promise<void> => {
  const assets = getAmbientAssets();
  await preloadImages(assets);
};

/**
 * Preload all assets with progress tracking
 */
export const preloadAllAssets = async (
  config: PreloadConfig,
  onProgress?: (progress: PreloadProgress) => void
): Promise<void> => {
  const progress: PreloadProgress = {
    critical: false,
    secondary: false,
    ambient: false,
  };

  // Critical (blocking)
  await preloadCriticalAssets(config.timeOfDay, config.season);
  progress.critical = true;
  onProgress?.(progress);

  // Secondary (parallel with ambient)
  const secondaryPromise = preloadSecondaryAssets(
    config.ageGroup,
    config.householdType
  ).then(() => {
    progress.secondary = true;
    onProgress?.(progress);
  });

  const ambientPromise = preloadAmbientAssets().then(() => {
    progress.ambient = true;
    onProgress?.(progress);
  });

  await Promise.all([secondaryPromise, ambientPromise]);
};

// ============================================================================
// Preload Hook
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useWorldSignals } from '../state/worldSignals';

export interface UsePreloadResult {
  isLoading: boolean;
  progress: PreloadProgress;
  error: Error | null;
  retry: () => void;
}

export const usePreload = (): UsePreloadResult => {
  const { timeOfDay, season, ageGroup, householdType } = useWorldSignals();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<PreloadProgress>({
    critical: false,
    secondary: false,
    ambient: false,
  });
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await preloadAllAssets(
        { timeOfDay, season, ageGroup, householdType },
        setProgress
      );
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to preload assets'));
    } finally {
      setIsLoading(false);
    }
  }, [timeOfDay, season, ageGroup, householdType]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    isLoading,
    progress,
    error,
    retry: load,
  };
};
