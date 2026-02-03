/**
 * Settings Screen (S-06: 設定)
 *
 * App settings and preferences.
 * Includes debug panel for testing world signals.
 */

import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Spacer } from '../components/atoms';
import { Chip, Button, SettingsRow } from '../components/molecules';
import { HeaderBar } from '../components/organisms';
import { AppShell, ModalShell } from '../components/templates';
import { theme } from '../tokens';
import {
  useWorldSignals,
  AgeGroup,
  HouseholdType,
  TIME_ORDER,
  SEASON_ORDER,
} from '../state/worldSignals';

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
      <Text variant="subheading">🛠 Debug: World Signals</Text>
      <Spacer size="md" />

      {/* Time of Day */}
      <View style={styles.debugSection}>
        <Text variant="caption" color={theme.colors.text.secondary}>
          Time of Day: {timeOfDay}
        </Text>
        <Spacer size="xs" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {TIME_ORDER.map((time) => (
              <Chip
                key={time}
                label={time}
                selected={timeOfDay === time}
                onPress={() => setTimeOfDay(time)}
              />
            ))}
          </View>
        </ScrollView>
        <View style={styles.sliderRow}>
          <Text variant="caption" color={theme.colors.text.tertiary}>
            Blend: {timeBlend.toFixed(2)}
          </Text>
          <View style={styles.sliderButtons}>
            <Button
              label="-"
              variant="secondary"
              size="sm"
              onPress={() => setTimeBlend(Math.max(0, timeBlend - 0.1))}
            />
            <Button
              label="+"
              variant="secondary"
              size="sm"
              onPress={() => setTimeBlend(Math.min(1, timeBlend + 0.1))}
            />
          </View>
        </View>
      </View>

      {/* Season */}
      <View style={styles.debugSection}>
        <Text variant="caption" color={theme.colors.text.secondary}>
          Season: {season}
        </Text>
        <Spacer size="xs" />
        <View style={styles.chipRow}>
          {SEASON_ORDER.map((s) => (
            <Chip
              key={s}
              label={s}
              selected={season === s}
              onPress={() => setSeason(s)}
            />
          ))}
        </View>
        <View style={styles.sliderRow}>
          <Text variant="caption" color={theme.colors.text.tertiary}>
            Blend: {seasonBlend.toFixed(2)}
          </Text>
          <View style={styles.sliderButtons}>
            <Button
              label="-"
              variant="secondary"
              size="sm"
              onPress={() => setSeasonBlend(Math.max(0, seasonBlend - 0.1))}
            />
            <Button
              label="+"
              variant="secondary"
              size="sm"
              onPress={() => setSeasonBlend(Math.min(1, seasonBlend + 0.1))}
            />
          </View>
        </View>
      </View>

      {/* Age Group */}
      <View style={styles.debugSection}>
        <Text variant="caption" color={theme.colors.text.secondary}>
          Age Group: {ageGroup}
        </Text>
        <Spacer size="xs" />
        <View style={styles.chipRow}>
          {ageGroups.map((age) => (
            <Chip
              key={age}
              label={age}
              selected={ageGroup === age}
              onPress={() => setAgeGroup(age)}
            />
          ))}
        </View>
      </View>

      {/* Household Type */}
      <View style={styles.debugSection}>
        <Text variant="caption" color={theme.colors.text.secondary}>
          Household: {householdType}
        </Text>
        <Spacer size="xs" />
        <View style={styles.chipRow}>
          {householdTypes.map((h) => (
            <Chip
              key={h}
              label={h}
              selected={householdType === h}
              onPress={() => setHouseholdType(h)}
            />
          ))}
        </View>
      </View>

      {/* Reset Button */}
      <Spacer size="sm" />
      <Button
        label="Reset to System Time"
        variant="primary"
        onPress={updateFromSystem}
        fullWidth
      />
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showKitchenSignals, setShowKitchenSignals] = useState(false);
  const [showDataInfo, setShowDataInfo] = useState(false);

  return (
    <AppShell showWorldBackground>
      {/* Header */}
      <HeaderBar
        title="設定"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text
            variant="caption"
            color={theme.colors.text.secondary}
            style={styles.sectionTitle}
          >
            通知
          </Text>
          <SettingsRow
            variant="chevron"
            label="通知設定"
            onPress={() => setShowNotifications(true)}
          />
        </View>

        {/* Sound Section */}
        <View style={styles.section}>
          <Text
            variant="caption"
            color={theme.colors.text.secondary}
            style={styles.sectionTitle}
          >
            サウンド
          </Text>
          <SettingsRow
            variant="toggle"
            label="環境音"
            value={ambientSound}
            onValueChange={setAmbientSound}
          />
          <SettingsRow
            variant="toggle"
            label="記録完了音"
            value={recordSound}
            onValueChange={setRecordSound}
          />
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text
            variant="caption"
            color={theme.colors.text.secondary}
            style={styles.sectionTitle}
          >
            データ
          </Text>
          <SettingsRow
            variant="chevron"
            label="Kitchen Signals"
            onPress={() => setShowKitchenSignals(true)}
          />
          <SettingsRow
            variant="chevron"
            label="データについて"
            onPress={() => setShowDataInfo(true)}
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text
            variant="caption"
            color={theme.colors.text.secondary}
            style={styles.sectionTitle}
          >
            アプリについて
          </Text>
          <SettingsRow
            variant="chevron"
            label="バージョン"
            value="1.0.0"
            onPress={() => {}}
          />
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyNote}>
          <Text variant="caption" color={theme.colors.text.secondary}>
            データは端末内に保存されています
          </Text>
        </View>

        {/* Debug Panel (Development Only) */}
        {__DEV__ && (
          <View style={styles.section}>
            <SettingsRow
              variant="toggle"
              label="🛠 Show Debug Panel"
              value={showDebug}
              onValueChange={setShowDebug}
            />
            {showDebug && <DebugPanel />}
          </View>
        )}
      </ScrollView>

      {/* Sub Screens */}
      <ModalShell
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        header={{ title: '通知設定' }}
        animationType="slide"
      >
        <View style={styles.modalContent} />
      </ModalShell>

      <ModalShell
        visible={showKitchenSignals}
        onClose={() => setShowKitchenSignals(false)}
        header={{ title: 'Kitchen Signals' }}
        animationType="slide"
      >
        <View style={styles.modalContent} />
      </ModalShell>

      <ModalShell
        visible={showDataInfo}
        onClose={() => setShowDataInfo(false)}
        header={{ title: 'データについて' }}
        animationType="slide"
      >
        <View style={styles.modalContent}>
          <Text variant="body">データは端末内に保存されています</Text>
        </View>
      </ModalShell>
    </AppShell>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  section: {
    paddingTop: theme.spacing.md,
  },
  sectionTitle: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  privacyNote: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },

  // Debug Panel Styles
  debugPanel: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.md,
    margin: theme.spacing.md,
  },
  debugSection: {
    marginBottom: theme.spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  sliderButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
});
