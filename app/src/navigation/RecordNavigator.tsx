/**
 * Record Navigator
 *
 * Stack navigation for the record flow screens (S-04a and onwards).
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecordScreen } from '../screens/RecordScreen';
import { RecordCameraScreen } from '../screens/RecordCameraScreen';
import { RecordCelebrationScreen } from '../screens/RecordCelebrationScreen';

export type RecordStackParamList = {
  RecordSelect: { photoUri?: string | null } | undefined;
  RecordCamera: undefined;
  RecordCelebration: undefined;
};

const Stack = createNativeStackNavigator<RecordStackParamList>();

export const RecordNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecordSelect" component={RecordScreen} />
      <Stack.Screen name="RecordCamera" component={RecordCameraScreen} />
      <Stack.Screen name="RecordCelebration" component={RecordCelebrationScreen} />
    </Stack.Navigator>
  );
};

RecordNavigator.displayName = 'RecordNavigator';
