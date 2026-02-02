/**
 * Home Screen (S-01: トップ画面)
 *
 * The kitchen world view. This is the main entry point showing
 * the 2.5D kitchen scene with ambient animations.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WorldScene } from '../components/world';
import { theme } from '../tokens';
import {
  useWorldSignals,
  TIME_ORDER,
  TimeOfDay,
  AgeGroup,
} from '../state/worldSignals';

// ============================================================================
// Dev Time Selector (Development Only)
// ============================================================================

const DevTimeSelector: React.FC = () => {
  const { timeOfDay, setTimeOfDay, ageGroup, setAgeGroup } = useWorldSignals();

  const ageGroups: AgeGroup[] = ['young', 'adult', 'mature'];

  // Display labels for time buttons
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
      <Text style={devStyles.title}>DEV: Layer Test</Text>

      {/* Time Selector */}
      <Text style={devStyles.label}>Time Overlay</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={devStyles.scrollRow}
      >
        {TIME_ORDER.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              devStyles.chip,
              timeOfDay === time && devStyles.chipActive,
            ]}
            onPress={() => setTimeOfDay(time)}
          >
            <Text
              style={[
                devStyles.chipText,
                timeOfDay === time && devStyles.chipTextActive,
              ]}
            >
              {timeLabels[time]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Character Selector */}
      <Text style={devStyles.label}>Character</Text>
      <View style={devStyles.row}>
        {ageGroups.map((age) => (
          <TouchableOpacity
            key={age}
            style={[
              devStyles.chip,
              ageGroup === age && devStyles.chipActive,
            ]}
            onPress={() => setAgeGroup(age)}
          >
            <Text
              style={[
                devStyles.chipText,
                ageGroup === age && devStyles.chipTextActive,
              ]}
            >
              {ageLabels[age]}
            </Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 12,
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  label: {
    color: '#fff',
    fontSize: 10,
    marginBottom: 4,
    marginTop: 8,
    opacity: 0.5,
  },
  scrollRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: theme.colors.accent.primary,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  chipTextActive: {
    opacity: 1,
    fontWeight: '600',
  },
});

// ============================================================================
// Home Screen
// ============================================================================

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Kitchen World */}
      <WorldScene />

      {/* Header with Settings Icon */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            // Navigate to settings
            // @ts-ignore - navigation type will be set up in TabNavigator
            navigation.navigate('Settings');
          }}
          accessibilityLabel="設定"
          accessibilityRole="button"
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Dev-only time selector for testing layer switching */}
      {__DEV__ && <DevTimeSelector />}
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
  settingsButton: {
    width: theme.size.tap.recommended,
    height: theme.size.tap.recommended,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },
});
