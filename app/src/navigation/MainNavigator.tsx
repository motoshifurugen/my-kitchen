/**
 * Main Navigator
 *
 * Root stack for the main app, providing modal record flow transitions.
 */

import React from 'react';
import { NavigationContainer, type NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator, type RootTabParamList } from './TabNavigator';
import { RecordNavigator } from './RecordNavigator';
import { useIsReducedMotion } from '../hooks/useReducedMotion';
import { duration } from '../tokens/motionTokens';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  RecordFlow: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainNavigator: React.FC = () => {
  const reduceMotionEnabled = useIsReducedMotion();
  const recordEntryDuration = reduceMotionEnabled
    ? duration.transition.fade
    : duration.slower;

  return (
    <NavigationContainer>
      <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="RecordFlow"
          component={RecordNavigator}
          options={{
            presentation: 'modal',
            animation: reduceMotionEnabled ? 'fade' : 'slide_from_bottom',
            animationDuration: recordEntryDuration,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

MainNavigator.displayName = 'MainNavigator';
