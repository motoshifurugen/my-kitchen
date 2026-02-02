/**
 * Motion Tokens Loader
 *
 * Loads and provides strongly-typed access to motion tokens from the UX spec.
 * Source of truth: docs/ux/phase-1/04-motion-tokens.json
 * (copied to app/src/tokens/motion-tokens.json for Metro bundler compatibility)
 */

import { Easing } from 'react-native';
import rawTokens from './motion-tokens.json';

// ============================================================================
// Type Definitions
// ============================================================================

interface TokenValue<T> {
  $value: T;
  $description?: string;
}

// ============================================================================
// Token Extractors
// ============================================================================

const extractValue = <T>(token: TokenValue<T>): T => token.$value;

const parseDuration = (value: string): number => {
  const match = value.match(/^(\d+)ms$/);
  return match ? parseInt(match[1]) : 0;
};

const parseDistance = (value: string): number => {
  if (value === 'screenHeight') return -1; // Special marker for runtime resolution
  const match = value.match(/^-?(\d+)pt$/);
  return match ? parseInt(match[1]) : 0;
};

/**
 * Parse CSS cubic-bezier to React Native Easing
 * cubic-bezier(x1, y1, x2, y2)
 */
const parseCubicBezier = (value: string): ((t: number) => number) => {
  const match = value.match(/cubic-bezier\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/);
  if (!match) return Easing.ease;
  return Easing.bezier(
    parseFloat(match[1]),
    parseFloat(match[2]),
    parseFloat(match[3]),
    parseFloat(match[4])
  );
};

// ============================================================================
// Duration Tokens (in milliseconds)
// ============================================================================

export const duration = {
  instant: parseDuration(extractValue(rawTokens.duration.instant)),
  fast: parseDuration(extractValue(rawTokens.duration.fast)),
  normal: parseDuration(extractValue(rawTokens.duration.normal)),
  slow: parseDuration(extractValue(rawTokens.duration.slow)),
  slower: parseDuration(extractValue(rawTokens.duration.slower)),
  transition: {
    fade: parseDuration(extractValue(rawTokens.duration.transition.fade)),
    slide: parseDuration(extractValue(rawTokens.duration.transition.slide)),
    overlay: parseDuration(extractValue(rawTokens.duration.transition.overlay)),
  },
  feedback: {
    tap: parseDuration(extractValue(rawTokens.duration.feedback.tap)),
  },
  celebration: parseDuration(extractValue(rawTokens.duration.celebration)),
  world: {
    breath: parseDuration(extractValue(rawTokens.duration.world.breath)),
    sway: parseDuration(extractValue(rawTokens.duration.world.sway)),
    light: parseDuration(extractValue(rawTokens.duration.world.light)),
    steam: parseDuration(extractValue(rawTokens.duration.world.steam)),
  },
} as const;

// ============================================================================
// Easing Tokens (React Native compatible)
// ============================================================================

export const easing = {
  easeOut: parseCubicBezier(extractValue(rawTokens.easing.easeOut)),
  easeInOut: parseCubicBezier(extractValue(rawTokens.easing.easeInOut)),
  easeOutSoft: parseCubicBezier(extractValue(rawTokens.easing.easeOutSoft)),
  // Aliases reference the base values in RN, we resolve them directly
  transition: parseCubicBezier(extractValue(rawTokens.easing.easeOut)), // {easing.easeOut}
  feedback: parseCubicBezier(extractValue(rawTokens.easing.easeOut)), // {easing.easeOut}
  celebration: parseCubicBezier(extractValue(rawTokens.easing.easeOutSoft)), // {easing.easeOutSoft}
  world: parseCubicBezier(extractValue(rawTokens.easing.easeInOut)), // {easing.easeInOut}
} as const;

// ============================================================================
// Distance Tokens (in points)
// ============================================================================

export const distance = {
  slide: {
    short: parseDistance(extractValue(rawTokens.distance.slide.short)),
    medium: parseDistance(extractValue(rawTokens.distance.slide.medium)),
  },
  overlay: {
    raise: parseDistance(extractValue(rawTokens.distance.overlay.raise)),
    full: parseDistance(extractValue(rawTokens.distance.overlay.full)), // -1 = screenHeight
  },
} as const;

// ============================================================================
// Scale Tokens
// ============================================================================

export const scale = {
  tap: {
    down: extractValue(rawTokens.scale.tap.down),
    up: extractValue(rawTokens.scale.tap.up),
  },
  world: {
    breathMin: extractValue(rawTokens.scale.world.breathMin),
    breathMax: extractValue(rawTokens.scale.world.breathMax),
  },
  modal: {
    enter: extractValue(rawTokens.scale.modal.enter),
  },
} as const;

// ============================================================================
// Transition Presets
// ============================================================================

export const transition = {
  fade: {
    duration: duration.transition.fade,
    easing: easing.easeOut,
  },
  slideRight: {
    duration: duration.transition.slide,
    easing: easing.easeOut,
    translateX: distance.slide.short,
  },
  slideLeft: {
    duration: duration.transition.slide,
    easing: easing.easeOut,
    translateX: -distance.slide.short,
  },
  overlay: {
    duration: duration.transition.overlay,
    easing: easing.easeOut,
    translateY: distance.overlay.raise,
  },
  modal: {
    duration: 250,
    easing: easing.easeOut,
    scale: scale.modal.enter,
  },
} as const;

// ============================================================================
// Celebration Sequence
// ============================================================================

interface CelebrationStep {
  step: string;
  delay: number;
  duration: number;
}

export const celebration = {
  sequence: extractValue(rawTokens.celebration.sequence) as CelebrationStep[],
  totalDuration: parseDuration(extractValue(rawTokens.celebration.totalDuration)),
} as const;

// ============================================================================
// Reduced Motion Alternatives
// ============================================================================

export const reducedMotion = {
  transition: {
    slide: extractValue(rawTokens.reducedMotion.transition.slide), // 'fade'
    overlay: extractValue(rawTokens.reducedMotion.transition.overlay), // 'fade'
  },
  celebration: extractValue(rawTokens.reducedMotion.celebration), // 'messageOnly'
  world: extractValue(rawTokens.reducedMotion.world), // 'static'
  tapFeedback: extractValue(rawTokens.reducedMotion.tapFeedback), // 'keep'
} as const;
