/**
 * Home Screen (S-01: トップ画面)
 *
 * The kitchen world view. This is the main entry point showing
 * the 2.5D kitchen scene with ambient animations.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WorldScene } from '../components/world';
import { Text, PressableBase } from '../components/atoms';
import { IconButton, Chip } from '../components/molecules';
import { theme } from '../tokens';
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
}

const DevLayerControls: React.FC<DevLayerControlsProps> = ({
  showCharacter,
  setShowCharacter,
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
        Character Age
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
// Home Screen
// ============================================================================

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  // Dev toggle for character layer
  const [showCharacter, setShowCharacter] = useState(true);

  return (
    <View style={styles.container}>
      {/* Kitchen World */}
      <WorldScene showCharacter={showCharacter} />

      {/* Header with Settings Icon */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <IconButton
          icon="Gear"
          onPress={() => {
            // @ts-ignore - navigation type will be set up in TabNavigator
            navigation.navigate('Settings');
          }}
          accessibilityLabel="設定"
        />
      </SafeAreaView>

      {/* Dev-only layer controls */}
      {__DEV__ && (
        <DevLayerControls
          showCharacter={showCharacter}
          setShowCharacter={setShowCharacter}
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingTop: theme.spacing.sm,
  },
});
