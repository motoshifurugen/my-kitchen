/**
 * AppImage Atom
 *
 * Wrapper around expo-image with sensible defaults.
 * Provides consistent image rendering across the app.
 */

import React from 'react';
import { Image, ImageProps, ImageContentFit, ImageContentPosition } from 'expo-image';
import { ViewStyle, StyleProp, ImageStyle } from 'react-native';
import { radius } from '../../tokens';

type RadiusSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface AppImageProps extends Omit<ImageProps, 'style'> {
  /** Image source (URI or require) */
  source: ImageProps['source'];
  /** Width of the image */
  width?: number;
  /** Height of the image */
  height?: number;
  /** How to fit the image (default: 'cover') */
  contentFit?: ImageContentFit;
  /** Position within container (default: 'center') */
  contentPosition?: ImageContentPosition;
  /** Border radius from tokens */
  rounded?: RadiusSize;
  /** Additional styles */
  style?: StyleProp<ImageStyle>;
  /** Placeholder blur hash */
  placeholder?: string;
  /** Transition duration in ms (default: 200) */
  transition?: number;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const radiusValues: Record<RadiusSize, number> = {
  none: radius.none,
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  xl: radius.xl,
  full: radius.full,
};

export const AppImage: React.FC<AppImageProps> = ({
  source,
  width,
  height,
  contentFit = 'cover',
  contentPosition = 'center',
  rounded = 'none',
  style,
  placeholder,
  transition = 200,
  accessibilityLabel,
  ...rest
}) => {
  const imageStyle: ImageStyle = {
    width,
    height,
    borderRadius: radiusValues[rounded],
  };

  return (
    <Image
      source={source}
      style={[imageStyle, style]}
      contentFit={contentFit}
      contentPosition={contentPosition}
      placeholder={placeholder}
      transition={transition}
      accessibilityLabel={accessibilityLabel}
      {...rest}
    />
  );
};

AppImage.displayName = 'AppImage';
