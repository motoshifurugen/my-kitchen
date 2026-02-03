/**
 * SettingsRow Molecule
 *
 * Row component for settings screens with two variants:
 * - chevron: navigational row with label, optional value, and chevron
 * - toggle: row with label and switch
 */

import React from 'react';
import { View, Switch, StyleSheet, ViewStyle } from 'react-native';
import { PressableBase, Text, Icon } from '../atoms';
import { colors, spacing, size } from '../../tokens';

interface BaseProps {
  /** Row label */
  label: string;
  /** Disabled state */
  disabled?: boolean;
}

interface ChevronRowProps extends BaseProps {
  /** Row variant */
  variant: 'chevron';
  /** Optional value text */
  value?: string;
  /** Press handler */
  onPress: () => void;
}

interface ToggleRowProps extends BaseProps {
  /** Row variant */
  variant: 'toggle';
  /** Toggle value */
  value: boolean;
  /** Value change handler */
  onValueChange: (value: boolean) => void;
}

export type SettingsRowProps = ChevronRowProps | ToggleRowProps;

export const SettingsRow: React.FC<SettingsRowProps> = (props) => {
  const { label, disabled = false, variant } = props;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.screen.horizontal,
    backgroundColor: colors.surface.elevated,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    minHeight: size.tap.recommended,
  };

  if (variant === 'toggle') {
    const { value, onValueChange } = props as ToggleRowProps;
    return (
      <View style={containerStyle}>
        <Text
          variant="body"
          color={disabled ? colors.text.disabled : colors.text.primary}
        >
          {label}
        </Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          accessibilityLabel={label}
          accessibilityRole="switch"
          accessibilityState={{ checked: value, disabled }}
          trackColor={{
            false: colors.border.default,
            true: colors.accent.primary,
          }}
          thumbColor={colors.surface.elevated}
        />
      </View>
    );
  }

  // Chevron variant
  const { value, onPress } = props as ChevronRowProps;
  return (
    <PressableBase
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text
        variant="body"
        color={disabled ? colors.text.disabled : colors.text.primary}
        style={styles.label}
      >
        {label}
      </Text>
      {value && (
        <Text variant="body" color={colors.text.secondary} style={styles.value}>
          {value}
        </Text>
      )}
      <Icon
        name="CaretRight"
        size={20}
        color={disabled ? colors.icon.disabled : colors.text.tertiary}
      />
    </PressableBase>
  );
};

SettingsRow.displayName = 'SettingsRow';

const styles = StyleSheet.create({
  label: {
    flex: 1,
  },
  value: {
    marginRight: spacing.sm,
  },
});
