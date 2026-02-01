/**
 * Theme Object
 *
 * Combines all design tokens into a single theme object
 * for consistent styling across the app.
 */

import { Platform, TextStyle, ViewStyle } from 'react-native';
import {
  colors,
  opacity,
  typography,
  spacing,
  size,
  radius,
  shadow,
  elevation,
  footer,
  focus,
} from './designTokens';
import {
  duration,
  easing,
  scale,
  transition,
  reducedMotion,
} from './motionTokens';

// ============================================================================
// Typography Helpers
// ============================================================================

const getFontFamily = (): string | undefined => {
  // iOS: undefined uses system font (SF Pro)
  // Android: Use Noto Sans JP
  return Platform.OS === 'android' ? typography.fontFamily.android : undefined;
};

const createTextStyle = (
  fontSize: number,
  fontWeight: TextStyle['fontWeight'],
  lineHeight: number,
  color: string = colors.text.primary
): TextStyle => ({
  fontFamily: getFontFamily(),
  fontSize,
  fontWeight,
  lineHeight: fontSize * lineHeight,
  color,
});

// ============================================================================
// Theme Object
// ============================================================================

export const theme = {
  // Colors
  colors,
  opacity,

  // Typography
  typography: {
    ...typography,
    fontFamily: getFontFamily(),
  },

  // Text Styles (ready to use)
  textStyles: {
    heading: createTextStyle(
      typography.style.heading.fontSize,
      typography.style.heading.fontWeight,
      typography.style.heading.lineHeight
    ),
    subheading: createTextStyle(
      typography.style.subheading.fontSize,
      typography.style.subheading.fontWeight,
      typography.style.subheading.lineHeight
    ),
    body: createTextStyle(
      typography.style.body.fontSize,
      typography.style.body.fontWeight,
      typography.style.body.lineHeight
    ),
    caption: createTextStyle(
      typography.style.caption.fontSize,
      typography.style.caption.fontWeight,
      typography.style.caption.lineHeight,
      colors.text.secondary
    ),
    button: createTextStyle(
      typography.style.button.fontSize,
      typography.style.button.fontWeight,
      typography.style.button.lineHeight
    ),
  },

  // Spacing
  spacing,

  // Sizes
  size,

  // Border Radius
  radius,

  // Shadows
  shadow,

  // Elevation (z-index)
  elevation,

  // Footer
  footer,

  // Focus
  focus,

  // Motion
  motion: {
    duration,
    easing,
    scale,
    transition,
    reducedMotion,
  },
} as const;

// ============================================================================
// Common Style Patterns
// ============================================================================

export const commonStyles = {
  // Screen container
  screen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  } as ViewStyle,

  // Card
  card: {
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.lg,
    ...shadow.md,
  } as ViewStyle,

  // Centered content
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  // Row layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  // Screen padding
  screenPadding: {
    paddingHorizontal: spacing.screen.horizontal,
    paddingVertical: spacing.screen.vertical,
  } as ViewStyle,

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  } as ViewStyle,
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
