/**
 * HeaderBar Organism
 *
 * Screen header with title, optional back button, and right action.
 * Handles safe area insets for status bar.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Icon, IconName } from '../atoms';
import { IconButton } from '../molecules';
import { colors, spacing, size } from '../../tokens';

export interface HeaderBarProps {
  /** Title text */
  title: string;
  /** Show back button */
  showBack?: boolean;
  /** Back button handler */
  onBack?: () => void;
  /** Right action icon */
  rightIcon?: IconName;
  /** Right action handler */
  onRightPress?: () => void;
  /** Right action accessibility label */
  rightAccessibilityLabel?: string;
  /** Transparent background (for overlay on world) */
  transparent?: boolean;
  /** Center the title (default: true when no back button) */
  centerTitle?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
  rightAccessibilityLabel,
  transparent = false,
  centerTitle,
}) => {
  const insets = useSafeAreaInsets();

  // Default: center title when no back button
  const shouldCenterTitle = centerTitle ?? !showBack;

  const containerStyle: ViewStyle = {
    paddingTop: insets.top + spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.screen.horizontal,
    backgroundColor: transparent ? 'transparent' : colors.background.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  return (
    <View style={containerStyle}>
      {/* Left slot */}
      <View style={styles.sideSlot}>
        {showBack && onBack && (
          <IconButton
            icon="CaretLeft"
            onPress={onBack}
            accessibilityLabel="戻る"
          />
        )}
      </View>

      {/* Title */}
      <View style={[styles.titleContainer, shouldCenterTitle && styles.titleCentered]}>
        <Text variant="heading" style={styles.title}>
          {title}
        </Text>
      </View>

      {/* Right slot */}
      <View style={styles.sideSlot}>
        {rightIcon && onRightPress && (
          <IconButton
            icon={rightIcon}
            onPress={onRightPress}
            accessibilityLabel={rightAccessibilityLabel || '操作'}
          />
        )}
      </View>
    </View>
  );
};

HeaderBar.displayName = 'HeaderBar';

const styles = StyleSheet.create({
  sideSlot: {
    width: size.tap.recommended,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  titleCentered: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
