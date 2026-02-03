/**
 * World Layout Constants
 *
 * Defines the coordinate system for the 2.5D kitchen world and character positioning.
 *
 * Coordinate Systems:
 * 1. ROOM PIXEL SPACE - Based on @2x kitchen_time assets (1536x2784)
 * 2. CHARACTER IMAGE SPACE - Based on @2x character assets (768x1392)
 *
 * The key insight is that each character age may have a different "foot anchor"
 * position within its image. This file defines the constants to ensure all
 * characters stand on the same floor line regardless of their internal layout.
 */

import type { AgeGroup } from '../state/worldSignals';

// ============================================================================
// Room Dimensions (@2x base resolution)
// ============================================================================

/**
 * Room dimensions measured from kitchen_time @2x assets
 */
export const ROOM = {
  /** Room width in pixels (@2x) */
  WIDTH: 1536,
  /** Room height in pixels (@2x) */
  HEIGHT: 2784,
  /**
   * Y coordinate of the floor line in room space (@2x).
   * This is the single shared floor line where all characters' feet should land.
   * Calibrate this value to match the visual floor in the kitchen background.
   */
  FLOOR_Y: 2200,
} as const;

// ============================================================================
// Character Dimensions (@2x base resolution)
// ============================================================================

/**
 * Character image dimensions measured from @2x character assets.
 * All age variants use the same image dimensions.
 */
export const CHARACTER = {
  /** Character image width in pixels (@2x) */
  WIDTH: 768,
  /** Character image height in pixels (@2x) */
  HEIGHT: 1392,
} as const;

// ============================================================================
// Per-Age Foot Anchor Positions
// ============================================================================

/**
 * Per-age foot anchor Y position in CHARACTER IMAGE SPACE (@2x).
 *
 * This is the Y coordinate within the character image where the bottom of
 * the character's feet should be. This varies by age because:
 * - Age20 and Age40 have the same internal foot position
 * - Age10 appears smaller/feet sit higher within the same image dimensions
 *
 * The formula for character placement is:
 *   characterTop = (ROOM.FLOOR_Y * scale) - (CHAR_FOOT_Y[age] * charScale)
 *
 * When CHAR_FOOT_Y is calibrated correctly, all ages will have their feet
 * planted on the same ROOM.FLOOR_Y line.
 */
export const CHAR_FOOT_Y: Record<AgeGroup, number> = {
  /** Age10 - feet sit higher in the image (character appears smaller) */
  young: 1370,
  /** Age20 - standard foot position */
  adult: 1500,
  /** Age40 - same as adult */
  mature: 1500,
} as const;

// ============================================================================
// Per-Age Scale Multipliers (Optional Fine-Tuning)
// ============================================================================

/**
 * Optional per-age scale multiplier for fine-tuning character sizes.
 *
 * Default is 1.0 for all ages. Adjust if a character needs to be slightly
 * larger or smaller while maintaining the foot anchor position.
 *
 * Range: typically 0.95 - 1.05
 */
export const CHAR_SCALE_MULT: Record<AgeGroup, number> = {
  young: 0.84,
  adult: 0.75,
  mature: 0.75,
} as const;

// ============================================================================
// Derived Helper Functions
// ============================================================================

/**
 * Calculate the scale factor from room space to screen space.
 *
 * @param containerWidth - The width of the container in screen pixels
 * @returns Scale factor to apply to room coordinates
 */
export const getRoomScale = (containerWidth: number): number => {
  return containerWidth / ROOM.WIDTH;
};

/**
 * Calculate the character scale factor.
 *
 * @param containerWidth - The width of the container in screen pixels
 * @param ageGroup - The character's age group
 * @returns Scale factor to apply to character dimensions
 */
export const getCharScale = (containerWidth: number, ageGroup: AgeGroup): number => {
  const roomScale = getRoomScale(containerWidth);
  return roomScale * CHAR_SCALE_MULT[ageGroup];
};

/**
 * Calculate the character's top position so feet land on FLOOR_Y.
 *
 * @param containerWidth - The width of the container in screen pixels
 * @param ageGroup - The character's age group
 * @returns Top position in screen pixels
 */
export const getCharacterTop = (containerWidth: number, ageGroup: AgeGroup): number => {
  const roomScale = getRoomScale(containerWidth);
  const charScale = getCharScale(containerWidth, ageGroup);
  return (ROOM.FLOOR_Y * roomScale) - (CHAR_FOOT_Y[ageGroup] * charScale);
};

/**
 * Calculate the character's left position (centered).
 *
 * @param containerWidth - The width of the container in screen pixels
 * @param ageGroup - The character's age group
 * @returns Left position in screen pixels
 */
export const getCharacterLeft = (containerWidth: number, ageGroup: AgeGroup): number => {
  const charScale = getCharScale(containerWidth, ageGroup);
  const characterWidth = CHARACTER.WIDTH * charScale;
  return (containerWidth - characterWidth) / 2;
};

/**
 * Get all character positioning properties.
 *
 * @param containerWidth - The width of the container in screen pixels
 * @param ageGroup - The character's age group
 * @returns Object with top, left, width, height in screen pixels
 */
export const getCharacterLayout = (
  containerWidth: number,
  ageGroup: AgeGroup
): { top: number; left: number; width: number; height: number } => {
  const charScale = getCharScale(containerWidth, ageGroup);
  return {
    top: getCharacterTop(containerWidth, ageGroup),
    left: getCharacterLeft(containerWidth, ageGroup),
    width: CHARACTER.WIDTH * charScale,
    height: CHARACTER.HEIGHT * charScale,
  };
};

/**
 * Get the floor line Y position in screen pixels (for dev visualization).
 *
 * @param containerWidth - The width of the container in screen pixels
 * @returns Floor Y position in screen pixels
 */
export const getFloorLineY = (containerWidth: number): number => {
  const roomScale = getRoomScale(containerWidth);
  return ROOM.FLOOR_Y * roomScale;
};

/**
 * Get the computed foot line Y position in screen pixels (for dev visualization).
 * This should match getFloorLineY when calibration is correct.
 *
 * @param containerWidth - The width of the container in screen pixels
 * @param ageGroup - The character's age group
 * @returns Computed foot Y position in screen pixels
 */
export const getComputedFootLineY = (
  containerWidth: number,
  ageGroup: AgeGroup
): number => {
  const charScale = getCharScale(containerWidth, ageGroup);
  const characterTop = getCharacterTop(containerWidth, ageGroup);
  return characterTop + (CHAR_FOOT_Y[ageGroup] * charScale);
};
