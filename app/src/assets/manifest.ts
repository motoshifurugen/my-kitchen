/**
 * Asset Manifest
 *
 * Central registry for all 2.5D world assets.
 * Maps stable enum keys to actual asset files.
 *
 * MVP Policy:
 * - Metro auto-selects @2x/@1x based on device pixel ratio
 * - Enum keys use camelCase (earlyMorning, not early-morning)
 * - Filenames use snake_case (time_early_morning)
 * - Require paths use base name WITHOUT @2x suffix (Metro handles this)
 *
 * Asset folder structure:
 *   assets/
 *     base/kitchen/base-kitchen@{1x,2x}.webp
 *     overlays/time/{time_early_morning|...}@{1x,2x}.webp
 *     characters/{girl_age10_base|...}@{1x,2x}.webp
 *     masks/room_mask@{1x,2x}.webp
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
  characters: Record<AgeGroup, ImageSourcePropType>;
  masks: {
    room: ImageSourcePropType;
  };
  // Legacy props (placeholder for future use)
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
// Placeholder Asset (for assets not yet created)
// ============================================================================

const PLACEHOLDER = {
  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
};

// ============================================================================
// Asset Manifest
//
// Mapping: enum key -> filename (Metro auto-selects @1x/@2x based on device)
//   TimeOfDay.earlyMorning -> time_early_morning.webp (@1x or @2x)
//   TimeOfDay.lateNight    -> time_late_night.webp
//   AgeGroup.young         -> girl_age10_base.webp
//   AgeGroup.adult         -> girl_age20_base.webp
//   AgeGroup.mature        -> girl_age40_base.webp
// ============================================================================

export const assetManifest: AssetManifest = {
  base: {
    kitchen: require('../../assets/base/kitchen/base-kitchen.webp'),
  },

  overlays: {
    time: {
      earlyMorning: require('../../assets/overlays/time/time_early_morning.webp'),
      morning: require('../../assets/overlays/time/time_morning.webp'),
      day: require('../../assets/overlays/time/time_day.webp'),
      evening: require('../../assets/overlays/time/time_evening.webp'),
      night: require('../../assets/overlays/time/time_night.webp'),
      lateNight: require('../../assets/overlays/time/time_late_night.webp'),
    },
    season: {
      // TODO: Season overlays not yet created
      spring: PLACEHOLDER,
      summer: PLACEHOLDER,
      autumn: PLACEHOLDER,
      winter: PLACEHOLDER,
    },
  },

  characters: {
    young: require('../../assets/characters/girl_age10_base.webp'),
    adult: require('../../assets/characters/girl_age20_base.webp'),
    mature: require('../../assets/characters/girl_age40_base.webp'),
  },

  masks: {
    room: require('../../assets/masks/room_mask.webp'),
  },

  // Legacy props structure (keep for backward compatibility)
  props: {
    age: {
      young: require('../../assets/characters/girl_age10_base.webp'),
      adult: require('../../assets/characters/girl_age20_base.webp'),
      mature: require('../../assets/characters/girl_age40_base.webp'),
    },
    household: {
      // TODO: Household props not yet created
      solo: PLACEHOLDER,
      family: PLACEHOLDER,
    },
  },

  ambient: {
    // TODO: Ambient assets not yet created
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
 * Get the character asset for a given age group
 */
export const getCharacterAsset = (ageGroup: AgeGroup): ImageSourcePropType => {
  return assetManifest.characters[ageGroup];
};

/**
 * Get the room mask asset
 */
export const getRoomMaskAsset = (): ImageSourcePropType => {
  return assetManifest.masks.room;
};

/**
 * Get the age props asset for a given age group
 * @deprecated Use getCharacterAsset instead
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
 * Critical assets needed for initial render (MVP)
 * These should be preloaded on app start
 */
export const getCriticalAssets = (
  timeOfDay: TimeOfDay,
  _season: Season // Not used in MVP, kept for API compatibility
): ImageSourcePropType[] => {
  return [
    assetManifest.base.kitchen,
    assetManifest.overlays.time[timeOfDay],
  ];
};

/**
 * Secondary assets that can be lazy-loaded
 */
export const getSecondaryAssets = (
  ageGroup: AgeGroup,
  _householdType: HouseholdType // Not used in MVP
): ImageSourcePropType[] => {
  return [
    assetManifest.characters[ageGroup],
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

// ============================================================================
// Asset Addition Guide
// ============================================================================

/**
 * HOW TO ADD NEW ASSETS:
 *
 * 1. Place the master file in docs/ux/phase-1/assets/_source/{category}/
 *    Example: docs/ux/phase-1/assets/_source/overlays/time/time_dusk__master.png
 *
 * 2. Generate @2x and @1x WebP outputs to app/assets/{category}/
 *    Example: app/assets/overlays/time/time_dusk@2x.webp
 *
 * 3. Add the enum key to the type definition (if new)
 *    Example: In worldSignals.ts, add 'dusk' to TimeOfDay
 *
 * 4. Add the require() to this manifest (use base name, Metro finds @1x/@2x)
 *    Example: dusk: require('../../assets/overlays/time/time_dusk.webp')
 *
 * 5. Update TIME_ORDER in worldSignals.ts (if time-related)
 *
 * Naming convention:
 *   Enum key: camelCase (earlyMorning)
 *   Filename: snake_case (time_early_morning)
 */
