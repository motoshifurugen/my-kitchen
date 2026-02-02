/**
 * WorldLayer Component
 *
 * A single layer in the 2.5D kitchen world composition.
 * Supports opacity animation for blending between states.
 *
 * Uses expo-image for better performance and consistent contentFit.
 */

import React from 'react';
import {
  StyleSheet,
  ImageSourcePropType,
  Animated,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';

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
  /**
   * Whether this layer is visible (for dev debugging)
   */
  visible?: boolean;
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
  visible = true,
}) => {
  // Skip rendering if not visible (dev toggle)
  if (!visible) {
    return null;
  }

  // Check if source is a placeholder (data URI)
  const isPlaceholder =
    typeof source === 'object' &&
    'uri' in source &&
    source.uri?.startsWith('data:');

  // If it's a placeholder and we have a dev color, show colored overlay
  if (isPlaceholder && devColor) {
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { zIndex, backgroundColor: devColor },
          typeof opacity === 'number' ? { opacity } : { opacity },
          style,
        ]}
        testID={testID}
      />
    );
  }

  // Render with animated opacity using Animated.View wrapper
  // (expo-image doesn't support Animated.Value directly)
  if (opacity instanceof Animated.Value) {
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { zIndex, opacity },
          style,
        ]}
        testID={testID}
      >
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition="center"
        />
      </Animated.View>
    );
  }

  // Render with static opacity
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { zIndex, opacity },
        style,
      ]}
      testID={testID}
    >
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="center"
      />
    </Animated.View>
  );
};
