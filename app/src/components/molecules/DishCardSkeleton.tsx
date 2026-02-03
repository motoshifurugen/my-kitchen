/**
 * DishCardSkeleton Molecule
 *
 * Displays a loading placeholder for dish cards.
 * Uses same dimensions as DishCardItem for seamless transitions.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '../../tokens';

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
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

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
