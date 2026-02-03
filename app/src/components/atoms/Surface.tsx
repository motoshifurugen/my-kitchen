/**
 * Surface Atom
 *
 * Container with background, border radius, and optional shadow.
 * Used as a building block for cards, panels, and elevated UI.
 */

import React from 'react';
import { View, ViewProps, ViewStyle, StyleSheet } from 'react-native';
import { colors, radius, shadow } from '../../tokens';

type RadiusSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ShadowSize = 'none' | 'sm' | 'md' | 'lg';

export interface SurfaceProps extends ViewProps {
  /** Border radius from tokens (default: 'md') */
  rounded?: RadiusSize;
  /** Shadow level from tokens (default: 'none') */
  elevation?: ShadowSize;
  /** Background color (default: colors.surface.elevated) */
  background?: string;
  /** Padding inside the surface */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Children content */
  children?: React.ReactNode;
}

const radiusValues: Record<RadiusSize, number> = {
  none: radius.none,
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  xl: radius.xl,
  full: radius.full,
};

const shadowStyles: Record<ShadowSize, ViewStyle> = {
  none: {},
  sm: shadow.sm,
  md: shadow.md,
  lg: shadow.lg,
};

const paddingValues: Record<string, number> = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
};

export const Surface: React.FC<SurfaceProps> = ({
  rounded = 'md',
  elevation = 'none',
  background = colors.surface.elevated,
  padding = 'none',
  style,
  children,
  ...rest
}) => {
  const surfaceStyle: ViewStyle = {
    backgroundColor: background,
    borderRadius: radiusValues[rounded],
    padding: paddingValues[padding],
    ...shadowStyles[elevation],
  };

  return (
    <View style={[surfaceStyle, style]} {...rest}>
      {children}
    </View>
  );
};

Surface.displayName = 'Surface';
