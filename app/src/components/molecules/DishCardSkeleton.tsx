/**
 * DishCardSkeleton Molecule
 *
 * Displays a loading placeholder for dish cards.
 * Uses same dimensions as DishCardItem for seamless transitions.
 *
 * @see docs/ux/phase-1/02-design-system.md §スケルトンスクリーン仕様
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '../../tokens';
import { useIsReducedMotion } from '../../hooks/useReducedMotion';

// Animation spec from design system
const BREATH_DURATION = 800;
const OPACITY_MIN = 0.3;
const OPACITY_MAX = 0.6;

export interface DishCardSkeletonProps {
  /** Card width (calculated from grid) */
  cardWidth: number;
  /** Card height (calculated from grid) */
  cardHeight: number;
}

export const DishCardSkeleton: React.FC<DishCardSkeletonProps> = ({
  cardWidth,
  cardHeight,
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

  const containerStyle: ViewStyle = {
    width: cardWidth,
    height: cardHeight,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Thumbnail placeholder */}
      <Animated.View
        style={[
          styles.thumbnailPlaceholder,
          { opacity: pulseAnim },
        ]}
      />

      {/* Info placeholder */}
      <View style={styles.info}>
        <Animated.View
          style={[
            styles.titlePlaceholder,
            { opacity: pulseAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.countPlaceholder,
            { opacity: pulseAnim },
          ]}
        />
      </View>
    </View>
  );
};

DishCardSkeleton.displayName = 'DishCardSkeleton';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.sm,
  },
  thumbnailPlaceholder: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
  },
  info: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  titlePlaceholder: {
    height: 14,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.sm,
    width: '70%',
  },
  countPlaceholder: {
    height: 12,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.sm,
    width: '40%',
  },
});
