/**
 * Time Utilities
 *
 * Functions for time-of-day and season calculations,
 * including interpolation between buckets.
 */

import {
  TimeOfDay,
  Season,
  TIME_ORDER,
  SEASON_ORDER,
  getNextTimeOfDay,
  getNextSeason,
} from '../state/worldSignals';
import { duration, easing } from '../tokens';

// ============================================================================
// Interpolation Helpers
// ============================================================================

/**
 * Linear interpolation between two values
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

/**
 * Apply easing function to interpolation factor
 * Uses the world easing from motion tokens
 */
export const applyEasing = (t: number): number => {
  return easing.world(t);
};

// ============================================================================
// Time Overlay Interpolation
// ============================================================================

export interface TimeOverlayState {
  current: TimeOfDay;
  next: TimeOfDay;
  blend: number; // 0.0 = current only, 1.0 = next only
}

/**
 * Get the current and next time overlays with blend factor
 */
export const getTimeOverlayState = (
  timeOfDay: TimeOfDay,
  blend: number
): TimeOverlayState => {
  return {
    current: timeOfDay,
    next: getNextTimeOfDay(timeOfDay),
    blend: applyEasing(blend),
  };
};

/**
 * Calculate opacity for current time overlay (fades out as blend increases)
 */
export const getCurrentTimeOpacity = (blend: number): number => {
  return 1 - applyEasing(blend);
};

/**
 * Calculate opacity for next time overlay (fades in as blend increases)
 */
export const getNextTimeOpacity = (blend: number): number => {
  return applyEasing(blend);
};

// ============================================================================
// Season Overlay Interpolation
// ============================================================================

export interface SeasonOverlayState {
  current: Season;
  next: Season;
  blend: number; // 0.0 = current only, 1.0 = next only
}

/**
 * Get the current and next season overlays with blend factor
 * Season transitions use a 2-week gradual blend
 */
export const getSeasonOverlayState = (
  season: Season,
  blend: number
): SeasonOverlayState => {
  return {
    current: season,
    next: getNextSeason(season),
    blend: applyEasing(blend),
  };
};

/**
 * Calculate opacity for current season overlay
 */
export const getCurrentSeasonOpacity = (blend: number): number => {
  return 1 - applyEasing(blend);
};

/**
 * Calculate opacity for next season overlay
 */
export const getNextSeasonOpacity = (blend: number): number => {
  return applyEasing(blend);
};

// ============================================================================
// Color Temperature Mapping
// ============================================================================

/**
 * Color temperature hints for each time of day
 * Used for tinting or shader effects if implemented
 *
 * Values represent kelvin-like temperature:
 * - Lower = warmer (amber)
 * - Higher = cooler (blue)
 */
export const TIME_COLOR_TEMPS: Record<TimeOfDay, number> = {
  earlyMorning: 4500, // Neutral to slightly cool
  morning: 5500, // Slightly cool, bright
  day: 6500, // Neutral, maximum brightness
  evening: 4000, // Warm, golden hour
  night: 3500, // Warm, indoor lighting
  lateNight: 2700, // Very warm, amber
};

/**
 * Get interpolated color temperature between current and next time
 */
export const getInterpolatedColorTemp = (
  current: TimeOfDay,
  next: TimeOfDay,
  blend: number
): number => {
  return lerp(TIME_COLOR_TEMPS[current], TIME_COLOR_TEMPS[next], applyEasing(blend));
};

// ============================================================================
// Animation Timing
// ============================================================================

/**
 * Get the duration for time overlay crossfade (from motion tokens)
 */
export const getOverlayTransitionDuration = (): number => {
  return duration.transition.overlay;
};

/**
 * Get world animation durations
 */
export const getWorldAnimationDurations = () => ({
  breath: duration.world.breath,
  sway: duration.world.sway,
  light: duration.world.light,
  steam: duration.world.steam,
});
