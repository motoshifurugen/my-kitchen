/**
 * DishCardItem Molecule
 *
 * Displays a single dish card in the archive grid.
 * Shows thumbnail, title, and cook count.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { PressableBase, Text, AppImage } from '../atoms';
import { colors, radius, spacing, shadow } from '../../tokens';
import { DishCard } from '../../features/archive/types';

// Re-export from utils for convenience
export { getCardDimensions } from './dishCardUtils';

export interface DishCardItemProps {
  /** Card data */
  card: DishCard;
  /** Card width (calculated from grid) */
  cardWidth: number;
  /** Card height (calculated from grid) */
  cardHeight: number;
  /** Press handler */
  onPress: (card: DishCard) => void;
}

export const DishCardItem: React.FC<DishCardItemProps> = ({
  card,
  cardWidth,
  cardHeight,
  onPress,
}) => {
  const containerStyle: ViewStyle = {
    width: cardWidth,
    height: cardHeight,
  };

  return (
    <PressableBase
      style={[styles.container, containerStyle]}
      onPress={() => onPress(card)}
      accessibilityLabel={`${card.title}、${card.cookCount}回作った`}
      accessibilityRole="button"
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        {card.photoUri ? (
          <AppImage
            source={{ uri: card.photoUri }}
            style={styles.thumbnail}
            contentFit="cover"
          />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <Text variant="caption" color={colors.text.tertiary}>
              📷
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text
          variant="caption"
          numberOfLines={1}
          style={styles.title}
        >
          {card.title}
        </Text>
        <Text variant="caption" color={colors.text.tertiary}>
          {card.cookCount}回
        </Text>
      </View>
    </PressableBase>
  );
};

DishCardItem.displayName = 'DishCardItem';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.sm,
  },
  thumbnailContainer: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: spacing.sm,
  },
  title: {
    marginBottom: spacing.xs,
  },
});
