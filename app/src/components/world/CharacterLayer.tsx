/**
 * CharacterLayer Component
 *
 * Renders the character sprite with per-age foot anchor positioning.
 * Ensures all characters stand on the same floor line regardless of
 * their internal image layout.
 *
 * Key features:
 * - Per-age foot anchor calibration via CHAR_FOOT_Y
 * - Optional per-age scale multiplier via CHAR_SCALE_MULT
 * - Dev-only floor and foot guide lines for calibration
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  LayoutChangeEvent,
} from 'react-native';
import { Image } from 'expo-image';
import type { AgeGroup } from '../../state/worldSignals';
import { getCharacterAsset } from '../../assets/manifest';
import {
  getCharacterLayout,
  getFloorLineY,
  getComputedFootLineY,
} from '../../constants/worldLayout';

// ============================================================================
// Types
// ============================================================================

export interface CharacterLayerProps {
  /** The character's age group */
  ageGroup: AgeGroup;
  /** Whether this layer is visible (default: true) */
  visible?: boolean;
  /** zIndex for layer ordering (default: 2) */
  zIndex?: number;
  /** Show floor guide line (DEV only) */
  showFloorGuide?: boolean;
  /** Show foot guide line (DEV only) */
  showFootGuide?: boolean;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// Component
// ============================================================================

export const CharacterLayer: React.FC<CharacterLayerProps> = ({
  ageGroup,
  visible = true,
  zIndex = 2,
  showFloorGuide = false,
  showFootGuide = false,
  testID = 'world-character',
}) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  // Skip rendering if not visible
  if (!visible) {
    return null;
  }

  // Calculate character layout
  const layout = containerWidth > 0
    ? getCharacterLayout(containerWidth, ageGroup)
    : null;

  // Get guide line positions for dev visualization
  const floorY = containerWidth > 0 ? getFloorLineY(containerWidth) : 0;
  const footY = containerWidth > 0 ? getComputedFootLineY(containerWidth, ageGroup) : 0;

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex }]}
      onLayout={handleLayout}
      testID={testID}
    >
      {/* Character Image */}
      {layout && (
        <Image
          source={getCharacterAsset(ageGroup)}
          style={{
            position: 'absolute',
            top: layout.top,
            left: layout.left,
            width: layout.width,
            height: layout.height,
          }}
          contentFit="contain"
          testID={`${testID}-image`}
        />
      )}

      {/* DEV: Floor guide line (red) */}
      {__DEV__ && showFloorGuide && containerWidth > 0 && (
        <View
          style={[
            styles.guideLine,
            styles.floorGuide,
            { top: floorY },
          ]}
          pointerEvents="none"
        />
      )}

      {/* DEV: Foot guide line (green) */}
      {__DEV__ && showFootGuide && containerWidth > 0 && (
        <View
          style={[
            styles.guideLine,
            styles.footGuide,
            { top: footY },
          ]}
          pointerEvents="none"
        />
      )}
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  guideLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
  },
  floorGuide: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
  },
  footGuide: {
    backgroundColor: 'rgba(0, 255, 0, 0.8)',
  },
});
