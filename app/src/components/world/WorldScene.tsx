/**
 * WorldScene Component
 *
 * Renders the layered 2.5D kitchen world.
 *
 * Layer stack (bottom to top):
 * 1. BaseKitchen - The kitchen background
 * 2. AgeProps - Props based on age group setting
 * 3. HouseholdProps - Props based on household type
 * 4. TimeOverlay - Time-of-day lighting overlay
 * 5. SeasonOverlay - Seasonal color overlay
 * 6. Ambient - Steam, light dust, etc.
 *
 * Time/Season overlays support interpolation between adjacent states.
 * Ambient layer is disabled when reduced motion is enabled.
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { WorldLayer } from './WorldLayer';
import { useWorldSignals } from '../../state/worldSignals';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  getBaseKitchenAsset,
  getTimeOverlayAsset,
  getSeasonOverlayAsset,
  getAgePropsAsset,
  getHouseholdPropsAsset,
  getAmbientAsset,
} from '../../assets/manifest';
import {
  getTimeOverlayState,
  getSeasonOverlayState,
  getCurrentTimeOpacity,
  getNextTimeOpacity,
  getCurrentSeasonOpacity,
  getNextSeasonOpacity,
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
}

// ============================================================================
// Dev Colors (for placeholder visualization)
// ============================================================================

const DEV_COLORS = {
  base: '#8B7355',      // Brown for kitchen base
  ageProps: '#A0522D',  // Sienna for age props
  household: '#CD853F', // Peru for household props
  time: {
    'early-morning': 'rgba(100, 120, 150, 0.3)', // Cool blue
    morning: 'rgba(255, 250, 230, 0.2)',         // Warm light
    day: 'rgba(255, 255, 255, 0.1)',             // Neutral
    evening: 'rgba(255, 200, 150, 0.3)',         // Golden
    night: 'rgba(50, 50, 80, 0.3)',              // Dark blue
    'late-night': 'rgba(30, 30, 50, 0.4)',       // Deep night
  },
  season: {
    spring: 'rgba(200, 255, 200, 0.15)',  // Light green
    summer: 'rgba(255, 255, 200, 0.15)',  // Light yellow
    autumn: 'rgba(255, 200, 150, 0.15)',  // Warm orange
    winter: 'rgba(200, 220, 255, 0.15)',  // Cool blue
  },
  ambient: 'rgba(255, 255, 255, 0.1)',
};

// ============================================================================
// Component
// ============================================================================

export const WorldScene: React.FC<WorldSceneProps> = ({
  blurred = false,
  devMode = __DEV__,
}) => {
  const {
    timeOfDay,
    season,
    ageGroup,
    householdType,
    timeBlend,
    seasonBlend,
  } = useWorldSignals();

  const { shouldAnimateWorld, isEnabled: reducedMotion } = useReducedMotion();

  // Animation values
  const breathAnim = useRef(new Animated.Value(1)).current;
  const blurAnim = useRef(new Animated.Value(blurred ? 1 : 0)).current;

  // Get current layer states
  const timeState = useMemo(
    () => getTimeOverlayState(timeOfDay, timeBlend),
    [timeOfDay, timeBlend]
  );

  const seasonState = useMemo(
    () => getSeasonOverlayState(season, seasonBlend),
    [season, seasonBlend]
  );

  // Breathing animation
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

  // Blur animation
  useEffect(() => {
    Animated.timing(blurAnim, {
      toValue: blurred ? 1 : 0,
      duration: duration.transition.overlay,
      easing: easing.transition,
      useNativeDriver: false, // Blur requires layout
    }).start();
  }, [blurred, blurAnim]);

  // Calculate opacities
  const currentTimeOpacity = getCurrentTimeOpacity(timeState.blend);
  const nextTimeOpacity = getNextTimeOpacity(timeState.blend);
  const currentSeasonOpacity = getCurrentSeasonOpacity(seasonState.blend);
  const nextSeasonOpacity = getNextSeasonOpacity(seasonState.blend);

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

      {/* Layer 2: Age Props */}
      <WorldLayer
        source={getAgePropsAsset(ageGroup)}
        zIndex={2}
        testID="world-age-props"
        devColor={devMode ? DEV_COLORS.ageProps : undefined}
      />

      {/* Layer 3: Household Props */}
      <WorldLayer
        source={getHouseholdPropsAsset(householdType)}
        zIndex={3}
        testID="world-household-props"
        devColor={devMode ? DEV_COLORS.household : undefined}
      />

      {/* Layer 4: Time Overlays (current + next for blending) */}
      <WorldLayer
        source={getTimeOverlayAsset(timeState.current)}
        opacity={currentTimeOpacity}
        zIndex={4}
        testID="world-time-current"
        devColor={devMode ? DEV_COLORS.time[timeState.current] : undefined}
      />
      {timeState.blend > 0 && (
        <WorldLayer
          source={getTimeOverlayAsset(timeState.next)}
          opacity={nextTimeOpacity}
          zIndex={5}
          testID="world-time-next"
          devColor={devMode ? DEV_COLORS.time[timeState.next] : undefined}
        />
      )}

      {/* Layer 5: Season Overlays (current + next for blending) */}
      <WorldLayer
        source={getSeasonOverlayAsset(seasonState.current)}
        opacity={currentSeasonOpacity}
        zIndex={6}
        testID="world-season-current"
        devColor={devMode ? DEV_COLORS.season[seasonState.current] : undefined}
      />
      {seasonState.blend > 0 && (
        <WorldLayer
          source={getSeasonOverlayAsset(seasonState.next)}
          opacity={nextSeasonOpacity}
          zIndex={7}
          testID="world-season-next"
          devColor={devMode ? DEV_COLORS.season[seasonState.next] : undefined}
        />
      )}

      {/* Layer 6: Ambient Effects (disabled in reduced motion) */}
      {shouldAnimateWorld && (
        <AmbientLayer devMode={devMode} />
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
// Ambient Layer (animated steam, light dust)
// ============================================================================

interface AmbientLayerProps {
  devMode?: boolean;
}

const AmbientLayer: React.FC<AmbientLayerProps> = ({ devMode }) => {
  const steamOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle steam animation
    const steamCycle = Animated.loop(
      Animated.sequence([
        Animated.timing(steamOpacity, {
          toValue: 0.6,
          duration: duration.world.steam / 2,
          easing: easing.world,
          useNativeDriver: true,
        }),
        Animated.timing(steamOpacity, {
          toValue: 0.3,
          duration: duration.world.steam / 2,
          easing: easing.world,
          useNativeDriver: true,
        }),
      ])
    );

    steamCycle.start();

    return () => steamCycle.stop();
  }, [steamOpacity]);

  return (
    <WorldLayer
      source={getAmbientAsset('steam_01')}
      opacity={steamOpacity}
      zIndex={10}
      testID="world-ambient"
      devColor={devMode ? DEV_COLORS.ambient : undefined}
    />
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
