/**
 * Chip Molecule
 *
 * Pill-shaped selection component for filters, tags, etc.
 * States: default, selected, disabled
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { PressableBase, Text, Icon, IconName } from '../atoms';
import { colors, radius, spacing } from '../../tokens';

export interface ChipProps {
  /** Chip label text */
  label: string;
  /** Selected state */
  selected?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Icon to show before label */
  icon?: IconName;
  /** Allow deselection when tapping selected chip */
  allowDeselect?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  disabled = false,
  icon,
  allowDeselect = true,
}) => {
  const handlePress = () => {
    if (disabled) return;
    if (selected && !allowDeselect) return;
    onPress?.();
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: selected ? colors.accent.primary : colors.border.default,
    backgroundColor: selected ? colors.accent.primary : colors.surface.elevated,
  };

  const textColor = selected ? colors.text.inverse : colors.text.secondary;
  const iconColor = selected ? colors.text.inverse : colors.icon.default;

  return (
    <PressableBase
      style={containerStyle}
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {icon && (
        <>
          <Icon name={icon} size={16} color={iconColor} />
          <View style={styles.iconSpacer} />
        </>
      )}
      <Text variant="caption" color={textColor}>
        {label}
      </Text>
    </PressableBase>
  );
};

Chip.displayName = 'Chip';

const styles = StyleSheet.create({
  iconSpacer: {
    width: spacing.xs,
  },
});
