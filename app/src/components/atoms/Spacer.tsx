/**
 * Spacer Atom
 *
 * Creates empty space using design token spacing values.
 * Use for consistent spacing between elements.
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { spacing } from '../../tokens';

type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface SpacerProps {
  /** Size from spacing tokens (default: 'md') */
  size?: SpacingSize;
  /** Direction of spacing (default: 'vertical') */
  direction?: 'vertical' | 'horizontal';
}

const spacingValues: Record<SpacingSize, number> = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
};

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
}) => {
  const dimension = spacingValues[size];

  const style: ViewStyle =
    direction === 'vertical'
      ? { height: dimension }
      : { width: dimension };

  return <View style={style} />;
};

Spacer.displayName = 'Spacer';
