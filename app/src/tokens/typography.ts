import { typography as designTypography } from './designTokens';

export const fontFamilies = {
  regular: 'ZenMaruGothic-Regular',
  medium: 'ZenMaruGothic-Medium',
  bold: 'ZenMaruGothic-Bold',
} as const;

export const fontSizes = {
  xs: designTypography.size.xs,
  sm: designTypography.size.sm,
  md: designTypography.size.md,
  lg: designTypography.size.lg,
  xl: designTypography.size.xl,
} as const;

const normalLineHeight = designTypography.lineHeight.normal;
const relaxedLineHeight = designTypography.lineHeight.relaxed;

const lineHeightFromSize = (size: number, ratio: number) =>
  Math.round(size * ratio);

export const lineHeights = {
  xs: lineHeightFromSize(fontSizes.xs, normalLineHeight),
  sm: lineHeightFromSize(fontSizes.sm, normalLineHeight),
  md: lineHeightFromSize(fontSizes.md, normalLineHeight),
  lg: lineHeightFromSize(fontSizes.lg, relaxedLineHeight),
  xl: lineHeightFromSize(fontSizes.xl, relaxedLineHeight),
} as const;
