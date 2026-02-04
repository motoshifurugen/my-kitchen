/**
 * Onboarding Navigator
 *
 * Stack navigation for the onboarding flow (S-07a → S-07b → S-07c).
 * Shown only on first app launch.
 *
 * Per UX spec (01-screen-flows.md §6.1):
 * - S-07a: Welcome
 * - S-07b: Kitchen Signals (age, household selection)
 * - S-07c: Completion
 *
 * Note: No Footer, No WorldScene during onboarding.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  OnboardingWelcomeScreen,
  OnboardingSignalsScreen,
  OnboardingCompleteScreen,
} from '../screens/onboarding';

export type OnboardingStackParamList = {
  Welcome: undefined;
  Signals: undefined;
  Complete: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export interface OnboardingNavigatorProps {
  onComplete: () => void;
}

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({
  onComplete,
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
        initialRouteName="Welcome"
      >
        <Stack.Screen name="Welcome" component={OnboardingWelcomeScreen} />
        <Stack.Screen name="Signals" component={OnboardingSignalsScreen} />
        <Stack.Screen name="Complete">
          {(props) => (
            <OnboardingCompleteScreen {...props} onComplete={onComplete} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

OnboardingNavigator.displayName = 'OnboardingNavigator';
