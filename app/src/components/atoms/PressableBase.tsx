/**
 * PressableBase Atom
 *
 * Base pressable component with centralized:
 * - Press feedback (opacity/scale)
 * - Accessibility props
 * - Touch target sizing
 *
 * All interactive components should use this as their base.
 */

import React, { useCallback } from 'react';
import {
  Pressable,
  PressableProps,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { opacity, size } from '../../tokens';

export interface PressableBaseProps extends Omit<PressableProps, 'style' | 'hitSlop' | 'accessibilityState'> {
  /** Custom style or style function */
  style?: ViewStyle | ViewStyle[] | ((state: { pressed: boolean }) => ViewStyle);
  /** Minimum touch target size (pass true for 44pt, or a number for custom size) */
  hitSlop?: number | boolean;
  /** Accessibility label (required for good a11y) */
  accessibilityLabel: string;
  /** Accessibility role */
  accessibilityRole?: PressableProps['accessibilityRole'];
  /** Additional accessibility state (merged with disabled) */
  accessibilityState?: Omit<NonNullable<PressableProps['accessibilityState']>, 'disabled'>;
  /** Disable the pressable */
  disabled?: boolean;
  /** Children content */
  children: React.ReactNode;
}

export const PressableBase: React.FC<PressableBaseProps> = ({
  style,
  hitSlop,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
  disabled = false,
  children,
  ...rest
}) => {

  // Calculate hitSlop for minimum touch target
  const computedHitSlop =
    hitSlop === true
      ? size.tap.minimum
      : typeof hitSlop === 'number'
        ? hitSlop
        : undefined;

  // Compute style based on pressed state
  const computeStyle = useCallback(
    ({ pressed }: { pressed: boolean }): ViewStyle => {
      let baseStyle: ViewStyle;
      if (typeof style === 'function') {
        baseStyle = style({ pressed });
      } else if (Array.isArray(style)) {
        baseStyle = StyleSheet.flatten(style) || {};
      } else {
        baseStyle = style || {};
      }

      // Apply pressed state feedback
      const pressedStyle: ViewStyle = pressed
        ? { opacity: opacity.pressed }
        : {};

      // Apply disabled state
      const disabledStyle: ViewStyle = disabled
        ? { opacity: opacity.disabled }
        : {};

      return StyleSheet.flatten([baseStyle, pressedStyle, disabledStyle]);
    },
    [style, disabled]
  );

  return (
    <Pressable
      style={computeStyle}
      hitSlop={computedHitSlop}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ ...accessibilityState, disabled }}
      disabled={disabled}
      {...rest}
    >
      {children}
    </Pressable>
  );
};

PressableBase.displayName = 'PressableBase';
