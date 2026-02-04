/**
 * Button Component (World-Consistent)
 *
 * A quiet but unmistakably usable button system aligned with the kitchen world.
 * Design intent: ceramic tag / paper label feel - subtle, warm, gentle.
 *
 * Variants:
 * - Primary: ceramic tag feel (warm solid background, subtle inset highlight)
 * - Secondary: paper label feel (transparent or very light fill, subtle edge)
 * - Tertiary: text-only action (no background, no border)
 *
 * States:
 * - default / pressed (translateY 1-2px + tone shift, 150-200ms) / disabled
 *
 * @see docs/world-bible/core-philosophy.md - UI should be quiet but unmistakably usable
 */

import React, { useRef, useCallback, useState } from 'react';
import { View, ViewStyle, StyleSheet, Animated, Pressable } from 'react-native';
import { Text, Icon, IconName } from '../atoms';
import { colors, radius, spacing, size, easing } from '../../tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
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
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Custom style */
  style?: ViewStyle;
}

// Size configuration
const sizeConfig: Record<ButtonSize, { paddingH: number; paddingV: number; minHeight: number; iconSize: number }> = {
  sm: { paddingH: spacing.md, paddingV: spacing.xs, minHeight: size.tap.minimum, iconSize: 16 },
  md: { paddingH: spacing.lg, paddingV: spacing.sm, minHeight: size.tap.minimum, iconSize: 20 },
  lg: { paddingH: spacing.xl, paddingV: spacing.md, minHeight: size.tap.minimum, iconSize: 24 },
};

// Press animation: scale down slightly (0.98) or translateY 1px
const PRESS_SCALE = 0.98;
const PRESS_DURATION = 175; // 150-200ms

// Variant styles using tokens
const getVariantStyles = (variant: ButtonVariant, disabled: boolean) => {
  switch (variant) {
    case 'primary':
      return {
        default: {
          backgroundColor: disabled ? colors.button.primary.backgroundDisabled : colors.button.primary.background,
          borderWidth: 0,
        },
        pressed: {
          backgroundColor: colors.button.primary.backgroundPressed,
        },
        textColor: colors.button.primary.text,
      };
    case 'secondary':
      return {
        default: {
          backgroundColor: colors.button.secondary.background,
          borderWidth: 1,
          borderColor: disabled ? colors.button.secondary.borderDisabled : colors.button.secondary.border,
        },
        pressed: {
          backgroundColor: colors.button.secondary.backgroundPressed,
        },
        textColor: disabled ? colors.button.secondary.textDisabled : colors.button.secondary.text,
      };
    case 'tertiary':
      return {
        default: {
          backgroundColor: colors.button.tertiary.background,
          borderWidth: 0,
        },
        pressed: {
          backgroundColor: colors.button.tertiary.backgroundPressed,
        },
        textColor: disabled ? colors.button.tertiary.textDisabled : colors.button.tertiary.text,
      };
  }
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size: buttonSize = 'md',
  iconLeft,
  iconRight,
  disabled = false,
  onPress,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  const { paddingH, paddingV, minHeight, iconSize } = sizeConfig[buttonSize];
  const variantStyles = getVariantStyles(variant, disabled);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    setIsPressed(true);

    // Animate scale down (0.98)
    Animated.timing(scale, {
      toValue: PRESS_SCALE,
      duration: PRESS_DURATION,
      easing: easing.easeOut,
      useNativeDriver: true,
    }).start();
  }, [disabled, scale]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;
    setIsPressed(false);

    // Animate back
    Animated.timing(scale, {
      toValue: 1,
      duration: PRESS_DURATION,
      easing: easing.easeOut,
      useNativeDriver: true,
    }).start();
  }, [disabled, scale]);

  const containerStyle: ViewStyle = {
    ...variantStyles.default,
    paddingHorizontal: paddingH,
    paddingVertical: paddingV,
    minHeight,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    ...style,
  };

  // Apply pressed background color
  const currentBackgroundColor = isPressed && !disabled
    ? variantStyles.pressed.backgroundColor
    : variantStyles.default.backgroundColor;

  // Apply border color (for secondary variant)
  const currentBorderColor = variant === 'secondary'
    ? variantStyles.default.borderColor
    : undefined;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => []}
    >
      <Animated.View
        style={[
          containerStyle,
          {
            backgroundColor: currentBackgroundColor,
            borderColor: currentBorderColor,
            opacity: disabled ? 0.5 : 1,
            transform: [{ scale }],
          },
        ]}
      >
        {iconLeft && (
          <View style={styles.iconLeft}>
            <Icon name={iconLeft} size={iconSize} color={variantStyles.textColor} />
          </View>
        )}
        <Text variant="button" color={variantStyles.textColor} allowFontScaling={true}>
          {label}
        </Text>
        {iconRight && (
          <View style={styles.iconRight}>
            <Icon name={iconRight} size={iconSize} color={variantStyles.textColor} />
          </View>
        )}
      </Animated.View>
    </Pressable>
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

