/**
 * IconButton Molecule
 *
 * Button with only an icon, for toolbar/header actions.
 * Ensures proper touch target sizing.
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import { PressableBase, Icon, IconName } from '../atoms';
import { colors, radius, size, spacing } from '../../tokens';

type IconButtonVariant = 'default' | 'filled' | 'ghost';

export interface IconButtonProps {
  /** Icon name from Phosphor */
  icon: IconName;
  /** Press handler */
  onPress?: () => void;
  /** Visual variant */
  variant?: IconButtonVariant;
  /** Icon size (default: 24) */
  iconSize?: number;
  /** Icon color override */
  iconColor?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Accessibility label (required) */
  accessibilityLabel: string;
}

const variantStyles: Record<IconButtonVariant, ViewStyle> = {
  default: {
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.full,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'default',
  iconSize = 24,
  iconColor,
  disabled = false,
  accessibilityLabel,
}) => {
  const resolvedColor = iconColor || (disabled ? colors.icon.disabled : colors.icon.default);

  const containerStyle: ViewStyle = {
    ...variantStyles[variant],
    width: size.tap.recommended,
    height: size.tap.recommended,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <PressableBase
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Icon name={icon} size={iconSize} color={resolvedColor} />
    </PressableBase>
  );
};

IconButton.displayName = 'IconButton';
