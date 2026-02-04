import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';
import { fontFamilies, fontSizes, lineHeights, colors } from '../../tokens';

export type TextWeight = 'regular' | 'medium' | 'bold';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface TextProps extends RNTextProps {
  weight?: TextWeight;
  size?: TextSize;
  color?: string;
  children: React.ReactNode;
  allowFontScaling?: boolean;
}

const weightToFamily: Record<TextWeight, string> = {
  regular: fontFamilies.regular,
  medium: fontFamilies.medium,
  bold: fontFamilies.bold,
};

export const Text: React.FC<TextProps> = ({
  weight = 'regular',
  size = 'md',
  color = colors.text.primary,
  style,
  children,
  allowFontScaling = true,
  ...rest
}) => {
  const baseStyle: TextStyle = {
    fontFamily: weightToFamily[weight],
    fontSize: fontSizes[size],
    lineHeight: lineHeights[size],
    color,
  };

  return (
    <RNText
      style={[baseStyle, style]}
      allowFontScaling={allowFontScaling}
      {...rest}
    >
      {children}
    </RNText>
  );
};

Text.displayName = 'UIText';
