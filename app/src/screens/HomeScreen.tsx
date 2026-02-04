/**
 * Home Screen (S-01: トップ画面)
 *
 * The kitchen world view. This is the main entry point showing
 * the 2.5D kitchen scene with ambient animations.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Switch,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WorldScene } from '../components/world';
import { Text, PressableBase, Icon, IconName } from '../components/atoms';
import { Text as UIText } from '../components/ui';
import { Chip } from '../components/molecules';
import { theme, footer as footerTokens, duration, easing } from '../tokens';
import {
  useWorldSignals,
  TIME_ORDER,
  TimeOfDay,
  AgeGroup,
} from '../state/worldSignals';

// ============================================================================
// Dev Layer Controls (Development Only)
// ============================================================================

interface DevLayerControlsProps {
  showCharacter: boolean;
  setShowCharacter: (value: boolean) => void;
  showGuides: boolean;
  setShowGuides: (value: boolean) => void;
}

const DevLayerControls: React.FC<DevLayerControlsProps> = ({
  showCharacter,
  setShowCharacter,
  showGuides,
  setShowGuides,
}) => {
  const { timeOfDay, setTimeOfDay, ageGroup, setAgeGroup } = useWorldSignals();

  const ageGroups: AgeGroup[] = ['young', 'adult', 'mature'];

  const timeLabels: Record<TimeOfDay, string> = {
    earlyMorning: '早朝',
    morning: '朝',
    day: '昼',
    evening: '夕',
    night: '夜',
    lateNight: '深夜',
  };

  const ageLabels: Record<AgeGroup, string> = {
    young: '10代',
    adult: '20代',
    mature: '40代',
  };

  return (
    <View style={devStyles.container}>
      <Text variant="caption" color="#fff" style={devStyles.title}>
        DEV: Layer Controls
      </Text>

      {/* Layer Visibility Toggle */}
      <View style={devStyles.toggleRow}>
        <Text variant="caption" color="#fff">Character Layer</Text>
        <Switch
          value={showCharacter}
          onValueChange={setShowCharacter}
          trackColor={{ false: '#555', true: theme.colors.accent.primary }}
          thumbColor="#fff"
        />
      </View>

      {/* Calibration Guides Toggle */}
      <View style={devStyles.toggleRow}>
        <Text variant="caption" color="#fff">
          Calibration Guides{' '}
          <Text variant="caption" color="rgba(255,0,0,0.8)">Floor</Text>
          {' / '}
          <Text variant="caption" color="rgba(0,255,0,0.8)">Foot</Text>
        </Text>
        <Switch
          value={showGuides}
          onValueChange={setShowGuides}
          trackColor={{ false: '#555', true: theme.colors.accent.primary }}
          thumbColor="#fff"
        />
      </View>

      {/* Time Selector */}
      <Text variant="caption" color="rgba(255,255,255,0.5)" style={devStyles.label}>
        Kitchen Time (base render)
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={devStyles.scrollRow}
      >
        {TIME_ORDER.map((time) => (
          <Chip
            key={time}
            label={timeLabels[time]}
            selected={timeOfDay === time}
            onPress={() => setTimeOfDay(time)}
          />
        ))}
      </ScrollView>

      {/* Character Selector */}
      <Text variant="caption" color="rgba(255,255,255,0.5)" style={devStyles.label}>
        Character Age (switch to verify foot alignment)
      </Text>
      <View style={devStyles.row}>
        {ageGroups.map((age) => (
          <Chip
            key={age}
            label={ageLabels[age]}
            selected={ageGroup === age}
            onPress={() => setAgeGroup(age)}
          />
        ))}
      </View>
    </View>
  );
};

const devStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 12,
    padding: 12,
  },
  title: {
    marginBottom: 8,
    opacity: 0.7,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    marginBottom: 4,
    marginTop: 8,
  },
  scrollRow: {
    flexDirection: 'row',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

// ============================================================================
// Large Rounded Button Component
// ============================================================================

interface LargeRoundedButtonProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
}

const LargeRoundedButton: React.FC<LargeRoundedButtonProps> = ({
  icon,
  label,
  onPress,
  accessibilityLabel,
}) => {
  return (
    <PressableBase
      style={styles.largeButton}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <View style={styles.largeButtonContent}>
        <Icon name={icon} size={32} color={theme.colors.text.primary} weight="fill" />
        <UIText size="md" weight="medium" color={theme.colors.text.primary} style={styles.largeButtonLabel}>
          {label}
        </UIText>
      </View>
    </PressableBase>
  );
};

// ============================================================================
// Home Screen
// ============================================================================

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Fade-in animation for first appearance after onboarding
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start from white (opacity 1)
  const [hasAnimated, setHasAnimated] = useState(false);

  // Dev toggle for character layer
  const [showCharacter, setShowCharacter] = useState(true);
  // Dev toggle for calibration guides
  const [showGuides, setShowGuides] = useState(false);
  const [showDevControls, setShowDevControls] = useState(true);

  // Fade-in animation on first mount (after onboarding)
  useEffect(() => {
    if (!hasAnimated) {
      // Start from white overlay, fade to transparent to reveal world
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800, // ゆっくりと世界が開ける（800ms）
        easing: easing.easeOut,
        useNativeDriver: true,
      }).start(() => {
        setHasAnimated(true);
      });
    }
  }, [hasAnimated, fadeAnim]);

  // Calculate button container position (above footer)
  const footerHeight = footerTokens.height + insets.bottom;
  const buttonContainerBottom = footerHeight + theme.spacing.lg;

  return (
    <View style={styles.container}>
      {/* Kitchen World */}
      <WorldScene
        showCharacter={showCharacter}
        showFloorGuide={__DEV__ && showGuides}
        showFootGuide={__DEV__ && showGuides}
      />

      {/* Dev-only controls toggle */}
      {__DEV__ && (
        <PressableBase
          style={[
            styles.devToggleButton,
            { top: insets.top + theme.spacing.sm },
          ]}
          onPress={() => setShowDevControls((prev) => !prev)}
          accessibilityLabel="DEVパネルを切り替える"
          accessibilityRole="button"
        >
          <Icon
            name={showDevControls ? 'X' : 'Info'}
            size={18}
            color={theme.colors.text.inverse}
          />
          <Text variant="caption" style={styles.devToggleLabel}>
            DEV
          </Text>
        </PressableBase>
      )}

      {/* Large Rounded Buttons: Shelf and Search */}
      <View
        style={[
          styles.buttonContainer,
          {
            bottom: buttonContainerBottom,
            paddingBottom: theme.spacing.lg,
          },
        ]}
      >
        <LargeRoundedButton
          icon="Books"
          label="棚"
          onPress={() => {
            // @ts-ignore - navigation type will be set up in TabNavigator
            navigation.navigate('Shelf');
          }}
          accessibilityLabel="棚"
        />
        <LargeRoundedButton
          icon="MagnifyingGlass"
          label="探索"
          onPress={() => {
            // @ts-ignore - navigation type will be set up in TabNavigator
            navigation.navigate('Search');
          }}
          accessibilityLabel="探索"
        />
      </View>

      {/* Dev-only layer controls */}
      {__DEV__ && showDevControls && (
        <DevLayerControls
          showCharacter={showCharacter}
          setShowCharacter={setShowCharacter}
          showGuides={showGuides}
          setShowGuides={setShowGuides}
        />
      )}

      {/* White overlay for fade-in animation (reveals world slowly) */}
      {!hasAnimated && (
        <Animated.View
          style={[
            styles.whiteOverlay,
            {
              opacity: fadeAnim,
            },
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
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.screen.horizontal,
  },
  largeButton: {
    flex: 1,
    maxWidth: 160,
    minHeight: 80,
    backgroundColor: theme.colors.surface.elevated,
    borderRadius: theme.radius.xl,
    ...theme.shadow.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  largeButtonLabel: {
    marginTop: theme.spacing.xs,
  },
  devToggleButton: {
    position: 'absolute',
    right: theme.spacing.screen.horizontal,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  devToggleLabel: {
    color: theme.colors.text.inverse,
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
});
