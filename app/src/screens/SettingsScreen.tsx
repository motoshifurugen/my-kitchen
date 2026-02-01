/**
 * Settings Screen (S-06: 設定)
 *
 * App settings and preferences.
 * Includes debug panel for testing world signals.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WorldScene } from '../components/world';
import { theme } from '../tokens';
import {
  useWorldSignals,
  TimeOfDay,
  Season,
  AgeGroup,
  HouseholdType,
  TIME_ORDER,
  SEASON_ORDER,
} from '../state/worldSignals';

// ============================================================================
// Settings Row Components
// ============================================================================

interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  value,
  onPress,
  rightElement,
}) => (
  <TouchableOpacity
    style={styles.settingsRow}
    onPress={onPress}
    disabled={!onPress}
  >
    <Text style={styles.settingsLabel}>{label}</Text>
    {value && <Text style={styles.settingsValue}>{value}</Text>}
    {rightElement}
    {onPress && <Text style={styles.chevron}>›</Text>}
  </TouchableOpacity>
);

interface SettingsToggleRowProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingsToggleRow: React.FC<SettingsToggleRowProps> = ({
  label,
  value,
  onValueChange,
}) => (
  <View style={styles.settingsRow}>
    <Text style={styles.settingsLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{
        false: theme.colors.border.default,
        true: theme.colors.accent.primary,
      }}
      thumbColor={theme.colors.surface.elevated}
    />
  </View>
);

// ============================================================================
// Debug Panel
// ============================================================================

const DebugPanel: React.FC = () => {
  const {
    timeOfDay,
    season,
    ageGroup,
    householdType,
    timeBlend,
    seasonBlend,
    setTimeOfDay,
    setSeason,
    setAgeGroup,
    setHouseholdType,
    setTimeBlend,
    setSeasonBlend,
    updateFromSystem,
  } = useWorldSignals();

  const ageGroups: AgeGroup[] = ['young', 'adult', 'mature'];
  const householdTypes: HouseholdType[] = ['solo', 'family'];

  return (
    <View style={styles.debugPanel}>
      <Text style={styles.debugTitle}>🛠 Debug: World Signals</Text>

      {/* Time of Day */}
      <View style={styles.debugSection}>
        <Text style={styles.debugLabel}>Time of Day: {timeOfDay}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {TIME_ORDER.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.chip,
                  timeOfDay === time && styles.chipActive,
                ]}
                onPress={() => setTimeOfDay(time)}
              >
                <Text
                  style={[
                    styles.chipText,
                    timeOfDay === time && styles.chipTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Blend: {timeBlend.toFixed(2)}</Text>
          <View style={styles.sliderButtons}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => setTimeBlend(Math.max(0, timeBlend - 0.1))}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => setTimeBlend(Math.min(1, timeBlend + 0.1))}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Season */}
      <View style={styles.debugSection}>
        <Text style={styles.debugLabel}>Season: {season}</Text>
        <View style={styles.chipRow}>
          {SEASON_ORDER.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, season === s && styles.chipActive]}
              onPress={() => setSeason(s)}
            >
              <Text
                style={[styles.chipText, season === s && styles.chipTextActive]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Blend: {seasonBlend.toFixed(2)}</Text>
          <View style={styles.sliderButtons}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => setSeasonBlend(Math.max(0, seasonBlend - 0.1))}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => setSeasonBlend(Math.min(1, seasonBlend + 0.1))}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Age Group */}
      <View style={styles.debugSection}>
        <Text style={styles.debugLabel}>Age Group: {ageGroup}</Text>
        <View style={styles.chipRow}>
          {ageGroups.map((age) => (
            <TouchableOpacity
              key={age}
              style={[styles.chip, ageGroup === age && styles.chipActive]}
              onPress={() => setAgeGroup(age)}
            >
              <Text
                style={[
                  styles.chipText,
                  ageGroup === age && styles.chipTextActive,
                ]}
              >
                {age}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Household Type */}
      <View style={styles.debugSection}>
        <Text style={styles.debugLabel}>Household: {householdType}</Text>
        <View style={styles.chipRow}>
          {householdTypes.map((h) => (
            <TouchableOpacity
              key={h}
              style={[styles.chip, householdType === h && styles.chipActive]}
              onPress={() => setHouseholdType(h)}
            >
              <Text
                style={[
                  styles.chipText,
                  householdType === h && styles.chipTextActive,
                ]}
              >
                {h}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={updateFromSystem}>
        <Text style={styles.resetButtonText}>Reset to System Time</Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================================================
// Settings Screen
// ============================================================================

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [ambientSound, setAmbientSound] = useState(true);
  const [recordSound, setRecordSound] = useState(true);
  const [showDebug, setShowDebug] = useState(__DEV__);

  return (
    <View style={styles.container}>
      {/* Blurred World Background */}
      <WorldScene blurred />

      {/* Content */}
      <SafeAreaView edges={['top']} style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="戻る"
            accessibilityRole="button"
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>設定</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>通知</Text>
            <SettingsRow label="通知設定" onPress={() => {}} />
          </View>

          {/* Sound Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>サウンド</Text>
            <SettingsToggleRow
              label="環境音"
              value={ambientSound}
              onValueChange={setAmbientSound}
            />
            <SettingsToggleRow
              label="記録完了音"
              value={recordSound}
              onValueChange={setRecordSound}
            />
          </View>

          {/* Data Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>データ</Text>
            <SettingsRow label="Kitchen Signals" onPress={() => {}} />
            <SettingsRow label="データについて" onPress={() => {}} />
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>アプリについて</Text>
            <SettingsRow label="バージョン" value="1.0.0" />
          </View>

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <Text style={styles.privacyNoteText}>
              ℹ️ データは端末内に保存されています
            </Text>
          </View>

          {/* Debug Panel (Development Only) */}
          {__DEV__ && (
            <View style={styles.section}>
              <SettingsToggleRow
                label="🛠 Show Debug Panel"
                value={showDebug}
                onValueChange={setShowDebug}
              />
              {showDebug && <DebugPanel />}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: theme.size.tap.minimum,
    height: theme.size.tap.minimum,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.text.primary,
  },
  title: {
    ...theme.textStyles.heading,
  },
  headerSpacer: {
    width: theme.size.tap.minimum,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingTop: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.textStyles.caption,
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.screen.horizontal,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.screen.horizontal,
    backgroundColor: theme.colors.surface.elevated,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  settingsLabel: {
    ...theme.textStyles.body,
    flex: 1,
  },
  settingsValue: {
    ...theme.textStyles.body,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
  chevron: {
    fontSize: 20,
    color: theme.colors.text.tertiary,
  },
  privacyNote: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  privacyNoteText: {
    ...theme.textStyles.caption,
    color: theme.colors.text.secondary,
  },

  // Debug Panel Styles
  debugPanel: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.md,
    margin: theme.spacing.md,
  },
  debugTitle: {
    ...theme.textStyles.subheading,
    marginBottom: theme.spacing.md,
  },
  debugSection: {
    marginBottom: theme.spacing.md,
  },
  debugLabel: {
    ...theme.textStyles.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  chip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.surface.elevated,
  },
  chipActive: {
    backgroundColor: theme.colors.accent.primary,
    borderColor: theme.colors.accent.primary,
  },
  chipText: {
    ...theme.textStyles.caption,
    color: theme.colors.text.secondary,
  },
  chipTextActive: {
    color: theme.colors.text.inverse,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  sliderLabel: {
    ...theme.textStyles.caption,
    color: theme.colors.text.tertiary,
  },
  sliderButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  sliderButton: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  resetButton: {
    backgroundColor: theme.colors.accent.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  resetButtonText: {
    ...theme.textStyles.button,
    color: theme.colors.text.inverse,
  },
});
