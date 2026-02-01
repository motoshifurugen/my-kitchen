/**
 * WorldLayer Component
 *
 * A single layer in the 2.5D kitchen world composition.
 * Supports opacity animation for blending between states.
 */

import React from 'react';
import {
  StyleSheet,
  Image,
  ImageSourcePropType,
  Animated,
  ViewStyle,
  ImageStyle,
} from 'react-native';

// ============================================================================
// Types
// ============================================================================

export interface WorldLayerProps {
  source: ImageSourcePropType;
  opacity?: number | Animated.Value;
  zIndex?: number;
  style?: ViewStyle;
  testID?: string;
  /**
   * Development mode: show colored overlay when asset is placeholder
   */
  devColor?: string;
}

// ============================================================================
// Component
// ============================================================================

export const WorldLayer: React.FC<WorldLayerProps> = ({
  source,
  opacity = 1,
  zIndex = 0,
  style,
  testID,
  devColor,
}) => {
  // Check if source is a placeholder (data URI)
  const isPlaceholder =
    typeof source === 'object' &&
    'uri' in source &&
    source.uri?.startsWith('data:');

  // If it's a placeholder and we have a dev color, show colored overlay
  if (isPlaceholder && devColor) {
    const animatedOpacity = opacity instanceof Animated.Value ? opacity : opacity;
    return (
      <Animated.View
        style={[
          styles.container,
          { zIndex, backgroundColor: devColor },
          typeof animatedOpacity === 'number'
            ? { opacity: animatedOpacity }
            : { opacity: animatedOpacity },
          style,
        ]}
        testID={testID}
      />
    );
  }

  // Render with animated opacity
  if (opacity instanceof Animated.Value) {
    return (
      <Animated.Image
        source={source}
        style={[
          styles.container as ImageStyle,
          styles.image,
          { zIndex, opacity },
          style as ImageStyle,
        ]}
        resizeMode="cover"
        testID={testID}
      />
    );
  }

  // Render with static opacity
  return (
    <Image
      source={source}
      style={[
        styles.container as ImageStyle,
        styles.image,
        { zIndex, opacity },
        style as ImageStyle,
      ]}
      resizeMode="cover"
      testID={testID}
    />
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
