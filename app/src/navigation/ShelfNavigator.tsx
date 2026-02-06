/**
 * Shelf Navigator
 *
 * Stack navigation for bookshelf flow:
 * - S-02a Bookshelf (棚図鑑)
 * - S-02b Encyclopedia Grid
 * - S-02c Bookshelf Log
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useIsReducedMotion } from '../hooks/useReducedMotion';
import {
  getSoftSlideTransitionConfig,
  getFadeTransitionConfig,
} from './transitions';
import {
  BookshelfScreen,
  EncyclopediaGridScreen,
  BookshelfLogScreen,
  RecipeScreen,
} from '../screens';
import type { DishCategory } from '../features/archive';
import type { MenuItem } from '../data/menuCatalog';

export type ShelfStackParamList = {
  Bookshelf: undefined;
  EncyclopediaGrid: {
    title: string;
    mode: 'all' | 'category' | 'favorite';
    category?: DishCategory;
    openCardId?: string;
  };
  BookshelfLog: undefined;
  Recipe: {
    title: string;
    menuId?: MenuItem['id'] | null;
  };
};

const Stack = createNativeStackNavigator<ShelfStackParamList>();

export const ShelfNavigator: React.FC = () => {
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
      <Stack.Screen name="Bookshelf" component={BookshelfScreen} />
      <Stack.Screen name="EncyclopediaGrid" component={EncyclopediaGridScreen} />
      <Stack.Screen name="BookshelfLog" component={BookshelfLogScreen} />
      <Stack.Screen name="Recipe" component={RecipeScreen} />
    </Stack.Navigator>
  );
};

ShelfNavigator.displayName = 'ShelfNavigator';
