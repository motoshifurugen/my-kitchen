/**
 * Settings Navigator
 *
 * Stack navigator for Settings screen with Soft Slide transition.
 * Used for: S-01 → S-06 (Settings)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useIsReducedMotion } from '../hooks/useReducedMotion';
import {
  getSoftSlideTransitionConfig,
  getFadeTransitionConfig,
} from './transitions';

export type SettingsStackParamList = {
  Settings: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsNavigator: React.FC = () => {
  const reduceMotionEnabled = useIsReducedMotion();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...(reduceMotionEnabled
          ? getFadeTransitionConfig()
          : getSoftSlideTransitionConfig()),
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

SettingsNavigator.displayName = 'SettingsNavigator';

