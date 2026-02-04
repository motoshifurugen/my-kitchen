/**
 * Token Module Index
 *
 * Re-exports all tokens and theme objects for convenient importing.
 */

// Design Tokens
export {
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

export { fontFamilies, fontSizes, lineHeights } from './typography';

// Motion Tokens
export {
  duration,
  easing,
  distance,
  scale,
  transition,
  celebration,
  reducedMotion,
} from './motionTokens';

// Theme
export { theme, commonStyles } from './theme';
export type { Theme, Colors, Spacing, Typography } from './theme';
