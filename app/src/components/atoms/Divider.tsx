/**
 * Divider Atom
 *
 * Visual separator line using design tokens.
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { colors, spacing } from '../../tokens';

export interface DividerProps {
  /** Direction of divider (default: 'horizontal') */
  direction?: 'horizontal' | 'vertical';
  /** Color override (default: colors.divider) */
  color?: string;
  /** Margin around the divider (default: none) */
  margin?: 'none' | 'sm' | 'md' | 'lg';
}

const marginValues: Record<string, number> = {
  none: 0,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
};

export const Divider: React.FC<DividerProps> = ({
  direction = 'horizontal',
  color = colors.divider,
  margin = 'none',
}) => {
  const marginValue = marginValues[margin];

  const style: ViewStyle =
    direction === 'horizontal'
      ? {
          height: StyleSheet.hairlineWidth,
          backgroundColor: color,
          marginVertical: marginValue,
        }
      : {
          width: StyleSheet.hairlineWidth,
          backgroundColor: color,
          marginHorizontal: marginValue,
        };

  return <View style={style} />;
};

Divider.displayName = 'Divider';
