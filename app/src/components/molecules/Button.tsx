/**
 * Button Molecule
 *
 * Primary interactive button with variants:
 * - primary: filled accent background
 * - secondary: outlined with border
 * - ghost: transparent with text only
 *
 * States: default, pressed, disabled
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { PressableBase, Text, Icon, IconName } from '../atoms';
import { colors, radius, spacing, opacity } from '../../tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Button text */
  label: string;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size */
  size?: ButtonSize;
  /** Icon to show before label */
  iconLeft?: IconName;
  /** Icon to show after label */
  iconRight?: IconName;
  /** Disabled state */
  disabled?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Full width button */
  fullWidth?: boolean;
  /** Accessibility label (defaults to label) */
  accessibilityLabel?: string;
}

const sizeConfig: Record<ButtonSize, { paddingH: number; paddingV: number; iconSize: number }> = {
  sm: { paddingH: spacing.md, paddingV: spacing.xs, iconSize: 16 },
  md: { paddingH: spacing.lg, paddingV: spacing.sm, iconSize: 20 },
  lg: { paddingH: spacing.xl, paddingV: spacing.md, iconSize: 24 },
};

const variantStyles: Record<ButtonVariant, { container: ViewStyle; textColor: string }> = {
  primary: {
    container: {
      backgroundColor: colors.accent.primary,
      borderWidth: 0,
    },
    textColor: colors.text.inverse,
  },
  secondary: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    textColor: colors.text.primary,
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    textColor: colors.accent.primary,
  },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled = false,
  onPress,
  fullWidth = false,
  accessibilityLabel,
}) => {
  const { paddingH, paddingV, iconSize } = sizeConfig[size];
  const { container: variantContainer, textColor } = variantStyles[variant];

  const containerStyle: ViewStyle = {
    ...variantContainer,
    paddingHorizontal: paddingH,
    paddingVertical: paddingV,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
  };

  return (
    <PressableBase
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityRole="button"
    >
      {iconLeft && (
        <View style={styles.iconLeft}>
          <Icon name={iconLeft} size={iconSize} color={textColor} />
        </View>
      )}
      <Text variant="button" color={textColor}>
        {label}
      </Text>
      {iconRight && (
        <View style={styles.iconRight}>
          <Icon name={iconRight} size={iconSize} color={textColor} />
        </View>
      )}
    </PressableBase>
  );
};

Button.displayName = 'Button';

const styles = StyleSheet.create({
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
});
