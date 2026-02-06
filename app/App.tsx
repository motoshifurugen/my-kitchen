/**
 * my-kitchen App Entry Point
 *
 * A cooking journal app with a 2.5D kitchen world.
 * "料理は静かな自己回復の儀式である" - Cooking is a quiet ritual of self-recovery.
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainNavigator, OnboardingNavigator } from './src/navigation';
import { useWorldSignalsUpdater } from './src/hooks';
import { usePreload } from './src/utils/preload';
import { theme } from './src/tokens';
import { runMigrations, seedRecipesIfNeeded } from './src/db';
import {
  useOnboardingState,
  selectShouldShowLoading,
  selectShouldShowOnboarding,
  selectShouldShowMainApp,
} from './src/state/onboardingState';
import { useWorldSignals } from './src/state/worldSignals';
import { getErrorMessage } from './src/utils/errorMessages';

// ============================================================================
// Loading Screen
// ============================================================================

void SplashScreen.preventAutoHideAsync();

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
  const [fontsLoaded, fontError] = useFonts({
    'ZenMaruGothic-Regular': require('./assets/fonts/ZenMaruGothic-Regular.ttf'),
    'ZenMaruGothic-Medium': require('./assets/fonts/ZenMaruGothic-Medium.ttf'),
    'ZenMaruGothic-Bold': require('./assets/fonts/ZenMaruGothic-Bold.ttf'),
  });
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<Error | null>(null);

  // Hydrate state from storage on mount
  const { hydrate: hydrateOnboarding, completeOnboarding } = useOnboardingState();
  const onboardingState = useOnboardingState();
  const { hydrateSignals, isSignalsHydrated } = useWorldSignals();

  // Update world signals based on system time (only after hydration)
  useWorldSignalsUpdater();

  // Preload critical assets
  const { isLoading: isPreloading, progress, error } = usePreload();

  useEffect(() => {
    // Hydrate both stores in parallel
    Promise.all([hydrateOnboarding(), hydrateSignals()]);
  }, [hydrateOnboarding, hydrateSignals]);

  useEffect(() => {
    let isMounted = true;
    runMigrations()
      .then(() => seedRecipesIfNeeded())
      .then(() => {
        if (isMounted) {
          setIsDbReady(true);
        }
      })
      .catch((error) => {
        console.error('[db] Migration failed', error);
        if (isMounted) {
          setDbError(error instanceof Error ? error : new Error('DB migration failed'));
          setIsDbReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  const showLoading = selectShouldShowLoading(onboardingState);
  const showOnboarding = selectShouldShowOnboarding(onboardingState);
  const showMainApp = selectShouldShowMainApp(onboardingState);

  // Show loading screen while:
  // 1. Onboarding state is hydrating
  // 2. World signals are hydrating
  // 3. Critical assets are loading
  const isHydrating = showLoading || !isSignalsHydrated;
  const isLoadingAssets = isPreloading && !progress.critical;

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (fontError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>フォントの読み込みに失敗しました</Text>
        <Text style={styles.errorDetail}>{fontError.message}</Text>
      </View>
    );
  }

  if (isHydrating || isLoadingAssets || !isDbReady) {
    return <LoadingScreen />;
  }

  if (dbError) {
    const { title, message } = getErrorMessage('load');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{title}</Text>
        <Text style={styles.errorMessage}>{message}</Text>
      </View>
    );
  }

  // Show error state if preloading failed
  if (error) {
    const { title, message } = getErrorMessage('load');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{title}</Text>
        <Text style={styles.errorMessage}>{message}</Text>
      </View>
    );
  }

  // Show onboarding if not completed
  if (showOnboarding) {
    return (
      <>
        <StatusBar style="dark" />
        <OnboardingNavigator onComplete={completeOnboarding} />
      </>
    );
  }

  // Show main app if onboarding completed
  if (showMainApp) {
    return (
      <>
        <StatusBar style="dark" />
        <MainNavigator />
      </>
    );
  }

  // Fallback (should not reach here)
  return <LoadingScreen />;
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
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    ...theme.textStyles.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
