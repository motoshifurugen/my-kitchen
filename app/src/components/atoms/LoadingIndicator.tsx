/**
 * LoadingIndicator Atom
 *
 * A subtle 3-dot breathing loading indicator.
 * Per design spec:
 * - Slow breathing animation (opacity 0.3 → 0.6 → 0.3)
 * - No blinking, no fast motion
 * - Color: text.tertiary (subtle)
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, AccessibilityRole } from 'react-native';
import { colors, spacing } from '../../tokens';
import { useIsReducedMotion } from '../../hooks/useReducedMotion';
import {
  LOADING_INDICATOR_BREATH_DURATION,
  LOADING_INDICATOR_OPACITY_MIN,
  LOADING_INDICATOR_OPACITY_MAX,
  LOADING_INDICATOR_DOT_SIZE,
} from './loadingIndicatorConstants';

// Re-export constants for convenience
export {
  LOADING_INDICATOR_BREATH_DURATION,
  LOADING_INDICATOR_OPACITY_MIN,
  LOADING_INDICATOR_OPACITY_MAX,
  LOADING_INDICATOR_DOT_COUNT,
  LOADING_INDICATOR_DOT_SIZE,
} from './loadingIndicatorConstants';

// Internal aliases for cleaner code
const BREATH_DURATION = LOADING_INDICATOR_BREATH_DURATION;
const OPACITY_MIN = LOADING_INDICATOR_OPACITY_MIN;
const OPACITY_MAX = LOADING_INDICATOR_OPACITY_MAX;
const DOT_SIZE = LOADING_INDICATOR_DOT_SIZE;

const DOT_GAP = {
  small: spacing.xs,
  medium: spacing.sm,
} as const;

export type LoadingIndicatorSize = 'small' | 'medium';

export interface LoadingIndicatorProps {
  /** Size variant */
  size?: LoadingIndicatorSize;
  /** Custom accessibility label */
  accessibilityLabel?: string;
  /** Test ID for the container */
  testID?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'small',
  accessibilityLabel = '読み込み中',
  testID = 'loading-indicator',
}) => {
  const isReducedMotion = useIsReducedMotion();
  const pulseAnim = useRef(new Animated.Value(OPACITY_MIN)).current;

  useEffect(() => {
    if (isReducedMotion) {
      // Static opacity for reduced motion
      pulseAnim.setValue((OPACITY_MIN + OPACITY_MAX) / 2);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: OPACITY_MAX,
          duration: BREATH_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: OPACITY_MIN,
          duration: BREATH_DURATION,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulseAnim, isReducedMotion]);

  const dotSize = DOT_SIZE[size];
  const dotGap = DOT_GAP[size];

  const dotStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: colors.text.tertiary,
  };

  return (
    <View
      testID={testID}
      style={[styles.container, { gap: dotGap }]}
      accessible
      accessibilityRole={'progressbar' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel}
    >
      {[0, 1, 2].map((index) => (
        <Animated.View
          key={index}
          testID={`loading-dot-${index}`}
          style={[dotStyle, { opacity: pulseAnim }]}
        />
      ))}
    </View>
  );
};

LoadingIndicator.displayName = 'LoadingIndicator';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
