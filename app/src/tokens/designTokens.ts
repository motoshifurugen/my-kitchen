/**
 * Design Tokens Loader
 *
 * Loads and provides strongly-typed access to design tokens from the UX spec.
 * Source of truth: docs/ux/phase-1/03-design-tokens.json
 * (copied to app/src/tokens/design-tokens.json for Metro bundler compatibility)
 */

import rawTokens from './design-tokens.json';

// ============================================================================
// Type Definitions
// ============================================================================

interface TokenValue<T> {
  $value: T;
  $description?: string;
}

interface SemanticColorSet {
  text: TokenValue<string>;
  background: TokenValue<string>;
  border: TokenValue<string>;
}

interface TypographyStyle {
  $description: string;
  size: TokenValue<string>;
  weight: TokenValue<number>;
  lineHeight: TokenValue<number>;
}

// ============================================================================
// Token Extractors
// ============================================================================

const extractValue = <T>(token: TokenValue<T>): T => token.$value;

const parseSize = (value: string): number => {
  const match = value.match(/^(\d+(?:\.\d+)?)(pt|px)?$/);
  return match ? parseFloat(match[1]) : 0;
};

// ============================================================================
// Color Tokens
// ============================================================================

export const colors = {
  background: {
    primary: extractValue(rawTokens.color.background.primary),
    secondary: extractValue(rawTokens.color.background.secondary),
    tertiary: extractValue(rawTokens.color.background.tertiary),
  },
  surface: {
    elevated: extractValue(rawTokens.color.surface.elevated),
    pressed: extractValue(rawTokens.color.surface.pressed),
    selected: extractValue(rawTokens.color.surface.selected),
  },
  text: {
    primary: extractValue(rawTokens.color.text.primary),
    secondary: extractValue(rawTokens.color.text.secondary),
    tertiary: extractValue(rawTokens.color.text.tertiary),
    inverse: extractValue(rawTokens.color.text.inverse),
    disabled: extractValue(rawTokens.color.text.disabled),
    link: extractValue(rawTokens.color.text.link),
  },
  icon: {
    default: extractValue(rawTokens.color.icon.default),
    active: extractValue(rawTokens.color.icon.active),
    disabled: extractValue(rawTokens.color.icon.disabled),
  },
  accent: {
    primary: extractValue(rawTokens.color.accent.primary),
    secondary: extractValue(rawTokens.color.accent.secondary),
    subtle: extractValue(rawTokens.color.accent.subtle),
  },
  button: {
    primary: {
      background: extractValue(rawTokens.color.button.primary.background),
      backgroundPressed: extractValue(rawTokens.color.button.primary.backgroundPressed),
      backgroundDisabled: extractValue(rawTokens.color.button.primary.backgroundDisabled),
      text: extractValue(rawTokens.color.button.primary.text),
    },
    secondary: {
      background: extractValue(rawTokens.color.button.secondary.background),
      backgroundPressed: extractValue(rawTokens.color.button.secondary.backgroundPressed),
      border: extractValue(rawTokens.color.button.secondary.border),
      borderDisabled: extractValue(rawTokens.color.button.secondary.borderDisabled),
      text: extractValue(rawTokens.color.button.secondary.text),
      textDisabled: extractValue(rawTokens.color.button.secondary.textDisabled),
    },
    tertiary: {
      background: extractValue(rawTokens.color.button.tertiary.background),
      backgroundPressed: extractValue(rawTokens.color.button.tertiary.backgroundPressed),
      text: extractValue(rawTokens.color.button.tertiary.text),
      textDisabled: extractValue(rawTokens.color.button.tertiary.textDisabled),
    },
  },
  semantic: {
    success: {
      text: extractValue((rawTokens.color.semantic.success as SemanticColorSet).text),
      background: extractValue((rawTokens.color.semantic.success as SemanticColorSet).background),
      border: extractValue((rawTokens.color.semantic.success as SemanticColorSet).border),
    },
    error: {
      text: extractValue((rawTokens.color.semantic.error as SemanticColorSet).text),
      background: extractValue((rawTokens.color.semantic.error as SemanticColorSet).background),
      border: extractValue((rawTokens.color.semantic.error as SemanticColorSet).border),
    },
    warning: {
      text: extractValue((rawTokens.color.semantic.warning as SemanticColorSet).text),
      background: extractValue((rawTokens.color.semantic.warning as SemanticColorSet).background),
      border: extractValue((rawTokens.color.semantic.warning as SemanticColorSet).border),
    },
  },
  border: {
    default: extractValue(rawTokens.color.border.default),
    focused: extractValue(rawTokens.color.border.focused),
    disabled: extractValue(rawTokens.color.border.disabled),
  },
  divider: extractValue(rawTokens.color.divider),
  overlay: {
    scrim: extractValue(rawTokens.color.overlay.scrim),
    soft: extractValue(rawTokens.color.overlay.soft),
  },
} as const;

// ============================================================================
// Opacity Tokens
// ============================================================================

export const opacity = {
  disabled: extractValue(rawTokens.opacity.disabled),
  pressed: extractValue(rawTokens.opacity.pressed),
} as const;

// ============================================================================
// Typography Tokens
// ============================================================================

export const typography = {
  fontFamily: {
    ios: extractValue(rawTokens.typography.fontFamily.ios),
    android: extractValue(rawTokens.typography.fontFamily.android),
  },
  weight: {
    regular: extractValue(rawTokens.typography.weight.regular),
    medium: extractValue(rawTokens.typography.weight.medium),
    semibold: extractValue(rawTokens.typography.weight.semibold),
  },
  size: {
    xs: parseSize(extractValue(rawTokens.typography.size.xs)),
    sm: parseSize(extractValue(rawTokens.typography.size.sm)),
    md: parseSize(extractValue(rawTokens.typography.size.md)),
    lg: parseSize(extractValue(rawTokens.typography.size.lg)),
    xl: parseSize(extractValue(rawTokens.typography.size.xl)),
    '2xl': parseSize(extractValue(rawTokens.typography.size['2xl'])),
  },
  lineHeight: {
    tight: extractValue(rawTokens.typography.lineHeight.tight),
    normal: extractValue(rawTokens.typography.lineHeight.normal),
    relaxed: extractValue(rawTokens.typography.lineHeight.relaxed),
  },
  letterSpacing: {
    normal: extractValue(rawTokens.typography.letterSpacing.normal),
    wide: extractValue(rawTokens.typography.letterSpacing.wide),
  },
  style: {
    heading: {
      fontSize: parseSize(extractValue((rawTokens.typography.style.heading as TypographyStyle).size)),
      fontWeight: String(extractValue((rawTokens.typography.style.heading as TypographyStyle).weight)) as '400' | '500' | '600',
      lineHeight: extractValue((rawTokens.typography.style.heading as TypographyStyle).lineHeight),
    },
    subheading: {
      fontSize: parseSize(extractValue((rawTokens.typography.style.subheading as TypographyStyle).size)),
      fontWeight: String(extractValue((rawTokens.typography.style.subheading as TypographyStyle).weight)) as '400' | '500' | '600',
      lineHeight: extractValue((rawTokens.typography.style.subheading as TypographyStyle).lineHeight),
    },
    body: {
      fontSize: parseSize(extractValue((rawTokens.typography.style.body as TypographyStyle).size)),
      fontWeight: String(extractValue((rawTokens.typography.style.body as TypographyStyle).weight)) as '400' | '500' | '600',
      lineHeight: extractValue((rawTokens.typography.style.body as TypographyStyle).lineHeight),
    },
    caption: {
      fontSize: parseSize(extractValue((rawTokens.typography.style.caption as TypographyStyle).size)),
      fontWeight: String(extractValue((rawTokens.typography.style.caption as TypographyStyle).weight)) as '400' | '500' | '600',
      lineHeight: extractValue((rawTokens.typography.style.caption as TypographyStyle).lineHeight),
    },
    button: {
      fontSize: parseSize(extractValue((rawTokens.typography.style.button as TypographyStyle).size)),
      fontWeight: String(extractValue((rawTokens.typography.style.button as TypographyStyle).weight)) as '400' | '500' | '600',
      lineHeight: extractValue((rawTokens.typography.style.button as TypographyStyle).lineHeight),
    },
  },
} as const;

// ============================================================================
// Spacing Tokens
// ============================================================================

export const spacing = {
  xs: parseSize(extractValue(rawTokens.spacing.xs)),
  sm: parseSize(extractValue(rawTokens.spacing.sm)),
  md: parseSize(extractValue(rawTokens.spacing.md)),
  lg: parseSize(extractValue(rawTokens.spacing.lg)),
  xl: parseSize(extractValue(rawTokens.spacing.xl)),
  '2xl': parseSize(extractValue(rawTokens.spacing['2xl'])),
  screen: {
    horizontal: parseSize(extractValue(rawTokens.spacing.screen.horizontal)),
    vertical: parseSize(extractValue(rawTokens.spacing.screen.vertical)),
  },
} as const;

// ============================================================================
// Size Tokens
// ============================================================================

export const size = {
  tap: {
    minimum: parseSize(extractValue(rawTokens.size.tap.minimum)),
    recommended: parseSize(extractValue(rawTokens.size.tap.recommended)),
  },
} as const;

// ============================================================================
// Radius Tokens
// ============================================================================

export const radius = {
  none: parseSize(extractValue(rawTokens.radius.none)),
  sm: parseSize(extractValue(rawTokens.radius.sm)),
  md: parseSize(extractValue(rawTokens.radius.md)),
  lg: parseSize(extractValue(rawTokens.radius.lg)),
  xl: parseSize(extractValue(rawTokens.radius.xl)),
  full: parseSize(extractValue(rawTokens.radius.full)),
} as const;

// ============================================================================
// Shadow Tokens (React Native compatible)
// ============================================================================

const parseShadow = (value: string) => {
  // Parse CSS shadow: "0 2px 8px rgba(0,0,0,0.08)"
  const match = value.match(/(\d+)\s+(\d+)px\s+(\d+)px\s+rgba\((\d+),(\d+),(\d+),([\d.]+)\)/);
  if (!match) {
    return { shadowOffset: { width: 0, height: 0 }, shadowRadius: 0, shadowOpacity: 0, shadowColor: '#000' };
  }
  return {
    shadowOffset: { width: parseInt(match[1]), height: parseInt(match[2]) },
    shadowRadius: parseInt(match[3]),
    shadowOpacity: parseFloat(match[7]),
    shadowColor: '#000',
    // Android elevation approximation
    elevation: Math.ceil(parseInt(match[3]) / 2),
  };
};

export const shadow = {
  sm: parseShadow(extractValue(rawTokens.shadow.sm)),
  md: parseShadow(extractValue(rawTokens.shadow.md)),
  lg: parseShadow(extractValue(rawTokens.shadow.lg)),
} as const;

// ============================================================================
// Elevation Tokens
// ============================================================================

export const elevation = {
  base: extractValue(rawTokens.elevation.base),
  card: extractValue(rawTokens.elevation.card),
  footer: extractValue(rawTokens.elevation.footer),
  overlay: extractValue(rawTokens.elevation.overlay),
  modal: extractValue(rawTokens.elevation.modal),
  toast: extractValue(rawTokens.elevation.toast),
} as const;

// ============================================================================
// Footer Tokens
// ============================================================================

export const footer = {
  height: parseSize(extractValue(rawTokens.footer.height)),
  background: extractValue(rawTokens.footer.background),
  borderWidth: 1,
  borderColor: colors.border.default,
} as const;

// ============================================================================
// Focus Tokens
// ============================================================================

export const focus = {
  ring: {
    color: extractValue(rawTokens.focus.ring.color),
    width: parseSize(extractValue(rawTokens.focus.ring.width)),
    offset: parseSize(extractValue(rawTokens.focus.ring.offset)),
  },
} as const;
