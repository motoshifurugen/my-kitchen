/**
 * Asset Manifest
 *
 * Central registry for all 2.5D world assets.
 * This manifest maps logical asset IDs to file paths.
 *
 * Asset folder structure:
 *   assets/
 *     base/kitchen/base@2x.webp
 *     overlays/time/{early-morning|morning|day|evening|night|late-night}@2x.png
 *     overlays/season/{spring|summer|autumn|winter}@2x.png
 *     props/age/{young|adult|mature}@2x.webp
 *     props/household/{solo|family}@2x.webp
 *     ambient/{steam_01|steam_02|light_dust}@2x.webp
 *
 * TODO: Replace placeholder requires with actual asset files when available.
 */

import { ImageSourcePropType } from 'react-native';
import { TimeOfDay, Season, AgeGroup, HouseholdType } from '../state/worldSignals';

// ============================================================================
// Type Definitions
// ============================================================================

export interface AssetManifest {
  base: {
    kitchen: ImageSourcePropType;
  };
  overlays: {
    time: Record<TimeOfDay, ImageSourcePropType>;
    season: Record<Season, ImageSourcePropType>;
  };
  props: {
    age: Record<AgeGroup, ImageSourcePropType>;
    household: Record<HouseholdType, ImageSourcePropType>;
  };
  ambient: {
    steam_01: ImageSourcePropType;
    steam_02: ImageSourcePropType;
    light_dust: ImageSourcePropType;
  };
}

// ============================================================================
// Placeholder Asset (colored rectangle for development)
// ============================================================================

// TODO: Remove this placeholder when real assets are available
// For now, we use a 1x1 pixel transparent PNG as placeholder
// In development, layers will show background colors instead
const PLACEHOLDER = { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' };

// ============================================================================
// Asset Manifest
// ============================================================================

/**
 * When real assets are available, replace PLACEHOLDER with:
 *
 * require('../../assets/base/kitchen/base@2x.webp')
 *
 * For time overlays:
 * require('../../assets/overlays/time/morning@2x.png')
 *
 * etc.
 */
export const assetManifest: AssetManifest = {
  base: {
    // TODO: Replace with require('../../assets/base/kitchen/base@2x.webp')
    kitchen: PLACEHOLDER,
  },

  overlays: {
    time: {
      // TODO: Replace with actual time overlay assets
      'early-morning': PLACEHOLDER,
      morning: PLACEHOLDER,
      day: PLACEHOLDER,
      evening: PLACEHOLDER,
      night: PLACEHOLDER,
      'late-night': PLACEHOLDER,
    },
    season: {
      // TODO: Replace with actual season overlay assets
      spring: PLACEHOLDER,
      summer: PLACEHOLDER,
      autumn: PLACEHOLDER,
      winter: PLACEHOLDER,
    },
  },

  props: {
    age: {
      // TODO: Replace with actual age prop assets
      young: PLACEHOLDER,
      adult: PLACEHOLDER,
      mature: PLACEHOLDER,
    },
    household: {
      // TODO: Replace with actual household prop assets
      solo: PLACEHOLDER,
      family: PLACEHOLDER,
    },
  },

  ambient: {
    // TODO: Replace with actual ambient loop assets
    steam_01: PLACEHOLDER,
    steam_02: PLACEHOLDER,
    light_dust: PLACEHOLDER,
  },
};

// ============================================================================
// Asset Path Helpers
// ============================================================================

/**
 * Get the base kitchen asset
 */
export const getBaseKitchenAsset = (): ImageSourcePropType => {
  return assetManifest.base.kitchen;
};

/**
 * Get the time overlay asset for a given time of day
 */
export const getTimeOverlayAsset = (timeOfDay: TimeOfDay): ImageSourcePropType => {
  return assetManifest.overlays.time[timeOfDay];
};

/**
 * Get the season overlay asset for a given season
 */
export const getSeasonOverlayAsset = (season: Season): ImageSourcePropType => {
  return assetManifest.overlays.season[season];
};

/**
 * Get the age props asset for a given age group
 */
export const getAgePropsAsset = (ageGroup: AgeGroup): ImageSourcePropType => {
  return assetManifest.props.age[ageGroup];
};

/**
 * Get the household props asset for a given household type
 */
export const getHouseholdPropsAsset = (householdType: HouseholdType): ImageSourcePropType => {
  return assetManifest.props.household[householdType];
};

/**
 * Get an ambient asset by name
 */
export const getAmbientAsset = (
  name: keyof AssetManifest['ambient']
): ImageSourcePropType => {
  return assetManifest.ambient[name];
};

// ============================================================================
// Preload Asset Lists
// ============================================================================

/**
 * Critical assets needed for initial render
 * These should be preloaded on app start
 */
export const getCriticalAssets = (
  timeOfDay: TimeOfDay,
  season: Season
): ImageSourcePropType[] => {
  return [
    assetManifest.base.kitchen,
    assetManifest.overlays.time[timeOfDay],
    assetManifest.overlays.season[season],
  ];
};

/**
 * Secondary assets that can be lazy-loaded
 */
export const getSecondaryAssets = (
  ageGroup: AgeGroup,
  householdType: HouseholdType
): ImageSourcePropType[] => {
  return [
    assetManifest.props.age[ageGroup],
    assetManifest.props.household[householdType],
  ];
};

/**
 * Ambient assets (lazy-loaded)
 */
export const getAmbientAssets = (): ImageSourcePropType[] => {
  return [
    assetManifest.ambient.steam_01,
    assetManifest.ambient.steam_02,
    assetManifest.ambient.light_dust,
  ];
};
