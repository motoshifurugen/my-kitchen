/**
 * WorldScene Component
 *
 * Renders the layered 2.5D kitchen world.
 *
 * Layer stack (bottom to top):
 * 1. KitchenTime - Time-based kitchen render (base layer)
 * 2. Character - Static character sprite based on age group
 * 3. (Mask - Wired for future use, not rendered in MVP)
 *
 * Note: Time overlay layer is REMOVED (Plan B: base replacement).
 * The kitchenTime assets are full renders per time-of-day, not overlays.
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { WorldLayer } from './WorldLayer';
import { CharacterLayer } from './CharacterLayer';
import { useWorldSignals } from '../../state/worldSignals';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  getKitchenTimeAsset,
  getRoomMaskAsset,
} from '../../assets/manifest';
import { colors, duration, easing, scale } from '../../tokens';

// ============================================================================
// Types
// ============================================================================

export interface WorldSceneProps {
  /**
   * Whether to show the world in blurred state (for overlay screens)
   */
  blurred?: boolean;
  /**
   * Development mode: show colored overlays for placeholder assets
   */
  devMode?: boolean;
  /**
   * Show mask layer (for debugging)
   */
  showMask?: boolean;
  /**
   * DEV: Show character layer (set to false to isolate rendering issues)
   */
  showCharacter?: boolean;
  /**
   * DEV: Show floor guide line for character calibration
   */
  showFloorGuide?: boolean;
  /**
   * DEV: Show foot guide line for character calibration
   */
  showFootGuide?: boolean;
}

// ============================================================================
// Dev Colors (for placeholder visualization)
// ============================================================================

const DEV_COLORS = {
  base: '#8B7355', // Brown for kitchen base
  character: '#A0522D', // Sienna for character
  mask: 'rgba(0, 0, 0, 0.5)',
};

// ============================================================================
// Component
// ============================================================================

export const WorldScene: React.FC<WorldSceneProps> = ({
  blurred = false,
  devMode = __DEV__,
  showMask = false,
  showCharacter = true,
  showFloorGuide = false,
  showFootGuide = false,
}) => {
  const { timeOfDay, ageGroup } = useWorldSignals();

  const { shouldAnimateWorld } = useReducedMotion();

  // Animation values
  const breathAnim = useRef(new Animated.Value(1)).current;
  const blurAnim = useRef(new Animated.Value(blurred ? 1 : 0)).current;

  // Breathing animation (subtle world pulse)
  useEffect(() => {
    if (!shouldAnimateWorld) {
      breathAnim.setValue(1);
      return;
    }

    const breathCycle = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: scale.world.breathMax,
          duration: duration.world.breath / 2,
          easing: easing.world,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: scale.world.breathMin,
          duration: duration.world.breath / 2,
          easing: easing.world,
          useNativeDriver: true,
        }),
      ])
    );

    breathCycle.start();

    return () => breathCycle.stop();
  }, [shouldAnimateWorld, breathAnim]);

  // Blur animation for screen transitions
  useEffect(() => {
    Animated.timing(blurAnim, {
      toValue: blurred ? 1 : 0,
      duration: duration.transition.overlay,
      easing: easing.transition,
      useNativeDriver: false, // Blur requires layout
    }).start();
  }, [blurred, blurAnim]);

  return (
    <View
      style={styles.container}
      accessible={false}
      accessibilityElementsHidden={true}
      importantForAccessibility="no-hide-descendants"
    >
      {/* Inner container with breathing animation */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ scale: breathAnim }],
          },
        ]}
      >
        {/* Layer 1: Time-based Kitchen (Plan B: base replacement) */}
        {/* This is the full kitchen render for the current time of day */}
        <WorldLayer
          source={getKitchenTimeAsset(timeOfDay)}
          zIndex={1}
          testID="world-kitchen-time"
          devColor={devMode ? DEV_COLORS.base : undefined}
        />

        {/* NOTE: Time overlay layer REMOVED (was causing double-room artifact) */}
        {/* The kitchenTime assets are full renders, not transparent overlays */}

        {/* Layer 2: Character with per-age foot anchor positioning */}
        <CharacterLayer
          ageGroup={ageGroup}
          zIndex={2}
          visible={showCharacter}
          showFloorGuide={showFloorGuide}
          showFootGuide={showFootGuide}
        />

        {/* Layer 3: Mask (wired for future, not shown by default) */}
        {showMask && (
          <WorldLayer
            source={getRoomMaskAsset()}
            zIndex={3}
            testID="world-mask"
            devColor={devMode ? DEV_COLORS.mask : undefined}
          />
        )}
      </Animated.View>

      {/* Blur overlay for screen transitions */}
      {blurred && (
        <Animated.View
          style={[
            styles.blurOverlay,
            {
              opacity: blurAnim,
            },
          ]}
        />
      )}
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.primary,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.soft,
    zIndex: 100,
  },
});
