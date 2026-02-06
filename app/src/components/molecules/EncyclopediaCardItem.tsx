/**
 * EncyclopediaCardItem Molecule
 *
 * Displays a single encyclopedia card in the grid.
 * Shows icon, title, and grade indicator (no numeric score).
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Text, AppImage, type AppImageProps } from '../atoms';
import { colors, radius, spacing, shadow, size } from '../../tokens';

const GRADE_STEPS = 4;

const getGradeLevel = (cookCount?: number): number => {
  const count = cookCount ?? 0;
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
};

const gradeLabelText = (gradeLevel: number, isEmpty: boolean) => {
  if (isEmpty || gradeLevel === 0) {
    return 'まだ記録がありません';
  }
  return '育ちのしるし';
};

export interface EncyclopediaCardItemProps {
  title: string;
  icon?: AppImageProps['source'];
  cookCount?: number;
  isEmpty?: boolean;
  cardWidth: number;
  cardHeight: number;
  onPress: () => void;
  disabled?: boolean;
}

export const EncyclopediaCardItem: React.FC<EncyclopediaCardItemProps> = ({
  title,
  icon,
  cookCount,
  isEmpty = false,
  cardWidth,
  cardHeight,
  onPress,
  disabled = false,
}) => {
  const containerStyle: ViewStyle = {
    width: cardWidth,
    height: cardHeight,
  };

  const gradeLevel = getGradeLevel(cookCount);
  const accessibilityLabel = `${title}、${gradeLabelText(gradeLevel, isEmpty)}`;
  
  // Show icon as silhouette (reduced opacity) if empty (unlocked but not cooked)
  const showIconSilhouette = isEmpty && icon;
  const showIcon = !isEmpty && icon;

  // Check if empty (not cooked yet) - but still allow interaction
  const isEmptyState = isEmpty;
  const DISABLED_OPACITY = 0.65; // Less transparent than opacity.disabled (0.4)

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        containerStyle,
        isEmptyState && styles.containerDisabled,
        // Apply base opacity for empty cards
        isEmptyState && { opacity: DISABLED_OPACITY },
        // Apply pressed feedback for all cards (including empty ones)
        pressed && { opacity: isEmptyState ? DISABLED_OPACITY * 0.92 : 0.92 },
      ]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={size.tap.minimum}
    >
      <View style={styles.iconContainer}>
        {showIcon ? (
          <AppImage source={icon} width={40} height={40} rounded="md" />
        ) : showIconSilhouette ? (
          <View style={styles.iconSilhouetteContainer}>
            <AppImage source={icon} width={40} height={40} rounded="md" />
          </View>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>

      <View style={styles.info}>
        <Text
          variant="caption"
          numberOfLines={1}
          style={[styles.title, isEmptyState && styles.titleDisabled]}
        >
          {title}
        </Text>
        <View style={styles.gradeRow}>
          {Array.from({ length: GRADE_STEPS }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.gradeDot,
                index < gradeLevel && styles.gradeDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
};

EncyclopediaCardItem.displayName = 'EncyclopediaCardItem';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.default,
    ...shadow.sm,
  },
  containerDisabled: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.disabled,
    // Remove shadow for disabled state (design system: disabled should have no shadow)
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 0,
    shadowColor: 'transparent',
    elevation: 0,
    // Set opacity to be less transparent than opacity.disabled (0.4) but still grayed out
    opacity: 0.65,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface.pressed,
  },
  iconSilhouetteContainer: {
    width: 40,
    height: 40,
    opacity: 0.3,
  },
  info: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  title: {
    textAlign: 'center',
  },
  titleDisabled: {
    color: colors.text.disabled,
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  gradeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border.default,
  },
  gradeDotActive: {
    backgroundColor: colors.accent.primary,
  },
});
