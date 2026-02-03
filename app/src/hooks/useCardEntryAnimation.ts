/**
 * useCardEntryAnimation Hook
 *
 * Provides subtle entry animation for dish cards.
 * Animation is restrained and not game-like:
 * - 300ms initial pause
 * - 180ms Fade + TranslateY + Scale animation
 */

import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export interface CardEntryAnimationConfig {
  /** Delay before animation starts (ms) */
  initialDelay: number;
  /** Animation duration (ms) */
  duration: number;
  /** Initial opacity (0-1) */
  initialOpacity: number;
  /** Final opacity (0-1) */
  finalOpacity: number;
  /** Initial Y translation (px) */
  initialTranslateY: number;
  /** Final Y translation (px) */
  finalTranslateY: number;
  /** Initial scale (0-1) */
  initialScale: number;
  /** Final scale (0-1) */
  finalScale: number;
  /** Use native driver for performance */
  useNativeDriver: boolean;
}

/**
 * Get animation configuration values.
 * Exported for testing purposes.
 */
export function getCardEntryAnimationConfig(): CardEntryAnimationConfig {
  return {
    initialDelay: 300,
    duration: 180,
    initialOpacity: 0,
    finalOpacity: 1,
    initialTranslateY: 8, // Subtle upward movement
    finalTranslateY: 0,
    initialScale: 0.95, // Subtle scale
    finalScale: 1,
    useNativeDriver: true,
  };
}

export interface UseCardEntryAnimationResult {
  /** Animated opacity value */
  opacity: Animated.Value;
  /** Animated translateY value */
  translateY: Animated.Value;
  /** Animated scale value */
  scale: Animated.Value;
  /** Whether animation has started */
  hasAnimated: boolean;
}

/**
 * Hook for card entry animation.
 * @param index - Card index for staggered animation (optional)
 * @param staggerDelay - Additional delay per card index (default: 50ms)
 */
export function useCardEntryAnimation(
  index: number = 0,
  staggerDelay: number = 50
): UseCardEntryAnimationResult {
  const config = getCardEntryAnimationConfig();

  const opacity = useRef(new Animated.Value(config.initialOpacity)).current;
  const translateY = useRef(new Animated.Value(config.initialTranslateY)).current;
  const scale = useRef(new Animated.Value(config.initialScale)).current;
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Calculate total delay with stagger
    const totalDelay = config.initialDelay + index * staggerDelay;

    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: config.finalOpacity,
        duration: config.duration,
        delay: totalDelay,
        useNativeDriver: config.useNativeDriver,
      }),
      Animated.timing(translateY, {
        toValue: config.finalTranslateY,
        duration: config.duration,
        delay: totalDelay,
        useNativeDriver: config.useNativeDriver,
      }),
      Animated.timing(scale, {
        toValue: config.finalScale,
        duration: config.duration,
        delay: totalDelay,
        useNativeDriver: config.useNativeDriver,
      }),
    ]);

    animation.start(() => {
      hasAnimatedRef.current = true;
    });

    return () => animation.stop();
  }, [index, staggerDelay, opacity, translateY, scale, config]);

  return {
    opacity,
    translateY,
    scale,
    hasAnimated: hasAnimatedRef.current,
  };
}
