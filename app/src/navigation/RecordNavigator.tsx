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
import { useIsReducedMotion } from '../hooks/useReducedMotion';
import { duration } from '../tokens/motionTokens';

export type RecordStackParamList = {
  RecordSelect: { photoUri?: string | null } | undefined;
  RecordCamera: undefined;
  RecordCelebration: {
    recipeTitle: string;
    recipeId: string;
    menuId?: string | null;
  };
};

const Stack = createNativeStackNavigator<RecordStackParamList>();

export const RecordNavigator: React.FC = () => {
  const reduceMotionEnabled = useIsReducedMotion();
  const recordEntryDuration = reduceMotionEnabled
    ? duration.transition.fade
    : duration.slower;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: reduceMotionEnabled ? 'fade' : 'slide_from_bottom',
        animationDuration: recordEntryDuration,
      }}
    >
      <Stack.Screen name="RecordSelect" component={RecordScreen} />
      <Stack.Screen name="RecordCamera" component={RecordCameraScreen} />
      <Stack.Screen
        name="RecordCelebration"
        component={RecordCelebrationScreen}
        options={{
          animation: reduceMotionEnabled ? 'fade' : 'none',
          animationTypeForReplace: reduceMotionEnabled ? 'push' : 'pop',
        }}
      />
    </Stack.Navigator>
  );
};

RecordNavigator.displayName = 'RecordNavigator';
