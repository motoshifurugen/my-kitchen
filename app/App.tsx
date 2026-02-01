/**
 * my-kitchen App Entry Point
 *
 * A cooking journal app with a 2.5D kitchen world.
 * "料理は静かな自己回復の儀式である" - Cooking is a quiet ritual of self-recovery.
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TabNavigator } from './src/navigation';
import { useWorldSignalsUpdater } from './src/hooks';
import { usePreload } from './src/utils/preload';
import { theme } from './src/tokens';

// ============================================================================
// Loading Screen
// ============================================================================

const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.accent.primary} />
    <Text style={styles.loadingText}>準備中...</Text>
  </View>
);

// ============================================================================
// App Content (with hooks)
// ============================================================================

const AppContent: React.FC = () => {
  // Update world signals based on system time
  useWorldSignalsUpdater();

  // Preload critical assets
  const { isLoading, progress, error } = usePreload();

  // Show loading screen while critical assets load
  if (isLoading && !progress.critical) {
    return <LoadingScreen />;
  }

  // Show error state if preloading failed
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>アセットの読み込みに失敗しました</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <TabNavigator />
    </>
  );
};

// ============================================================================
// App Root
// ============================================================================

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...theme.textStyles.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    ...theme.textStyles.subheading,
    color: theme.colors.semantic.error.text,
    marginBottom: theme.spacing.sm,
  },
  errorDetail: {
    ...theme.textStyles.caption,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});
