/**
 * WorldScene Component
 *
 * Renders the layered 2.5D kitchen world.
 *
 * MVP Layer stack (bottom to top):
 * 1. BaseKitchen - The kitchen background
 * 2. TimeOverlay - Time-of-day lighting overlay
 * 3. Character - Static character sprite based on age group
 * 4. (Mask - Wired for future use, not rendered in MVP)
 *
 * Post-MVP additions:
 * - Season overlay
 * - Household props
 * - Ambient animations (steam, light dust)
 * - Character frame animation
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { WorldLayer } from './WorldLayer';
import { useWorldSignals } from '../../state/worldSignals';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  getBaseKitchenAsset,
  getTimeOverlayAsset,
  getCharacterAsset,
  getRoomMaskAsset,
} from '../../assets/manifest';
import {
  getTimeOverlayState,
  getCurrentTimeOpacity,
  getNextTimeOpacity,
} from '../../utils/time';
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
}

// ============================================================================
// Dev Colors (for placeholder visualization)
// ============================================================================

const DEV_COLORS = {
  base: '#8B7355', // Brown for kitchen base
  character: '#A0522D', // Sienna for character
  time: {
    earlyMorning: 'rgba(100, 120, 150, 0.3)', // Cool blue
    morning: 'rgba(255, 250, 230, 0.2)', // Warm light
    day: 'rgba(255, 255, 255, 0.1)', // Neutral
    evening: 'rgba(255, 200, 150, 0.3)', // Golden
    night: 'rgba(50, 50, 80, 0.3)', // Dark blue
    lateNight: 'rgba(30, 30, 50, 0.4)', // Deep night
  },
  mask: 'rgba(0, 0, 0, 0.5)',
};

// ============================================================================
// Component
// ============================================================================

export const WorldScene: React.FC<WorldSceneProps> = ({
  blurred = false,
  devMode = __DEV__,
  showMask = false,
}) => {
  const { timeOfDay, ageGroup, timeBlend } = useWorldSignals();

  const { shouldAnimateWorld } = useReducedMotion();

  // Animation values
  const breathAnim = useRef(new Animated.Value(1)).current;
  const blurAnim = useRef(new Animated.Value(blurred ? 1 : 0)).current;

  // Get current time overlay state for blending
  const timeState = useMemo(
    () => getTimeOverlayState(timeOfDay, timeBlend),
    [timeOfDay, timeBlend]
  );

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

  // Calculate time overlay opacities for blending
  const currentTimeOpacity = getCurrentTimeOpacity(timeState.blend);
  const nextTimeOpacity = getNextTimeOpacity(timeState.blend);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: breathAnim }],
        },
      ]}
    >
      {/* Layer 1: Base Kitchen */}
      <WorldLayer
        source={getBaseKitchenAsset()}
        zIndex={1}
        testID="world-base"
        devColor={devMode ? DEV_COLORS.base : undefined}
      />

      {/* Layer 2: Time Overlay (current) */}
      <WorldLayer
        source={getTimeOverlayAsset(timeState.current)}
        opacity={currentTimeOpacity}
        zIndex={2}
        testID="world-time-current"
        devColor={devMode ? DEV_COLORS.time[timeState.current] : undefined}
      />

      {/* Layer 2b: Time Overlay (next, for blending) */}
      {timeState.blend > 0 && (
        <WorldLayer
          source={getTimeOverlayAsset(timeState.next)}
          opacity={nextTimeOpacity}
          zIndex={3}
          testID="world-time-next"
          devColor={devMode ? DEV_COLORS.time[timeState.next] : undefined}
        />
      )}

      {/* Layer 3: Character (static in MVP) */}
      <WorldLayer
        source={getCharacterAsset(ageGroup)}
        zIndex={4}
        testID="world-character"
        devColor={devMode ? DEV_COLORS.character : undefined}
      />

      {/* Layer 4: Mask (wired for future, not shown by default) */}
      {showMask && (
        <WorldLayer
          source={getRoomMaskAsset()}
          zIndex={5}
          testID="world-mask"
          devColor={devMode ? DEV_COLORS.mask : undefined}
        />
      )}

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
    </Animated.View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: colors.background.primary,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay.soft,
    zIndex: 100,
  },
});
