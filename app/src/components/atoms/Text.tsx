/**
 * Text Atom
 *
 * Typography primitive with token-based variants.
 * Uses design tokens for consistent typography across the app.
 */

import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { theme } from '../../tokens';

export type TextVariant = 'heading' | 'subheading' | 'body' | 'caption' | 'button';

export interface TextProps extends RNTextProps {
  /** Typography variant from design tokens */
  variant?: TextVariant;
  /** Override text color */
  color?: string;
  /** Children text content */
  children: React.ReactNode;
}

const variantStyles: Record<TextVariant, TextStyle> = {
  heading: theme.textStyles.heading,
  subheading: theme.textStyles.subheading,
  body: theme.textStyles.body,
  caption: theme.textStyles.caption,
  button: theme.textStyles.button,
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  style,
  children,
  ...rest
}) => {
  const baseStyle = variantStyles[variant];
  const colorStyle = color ? { color } : undefined;

  return (
    <RNText style={[baseStyle, colorStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};

Text.displayName = 'Text';
