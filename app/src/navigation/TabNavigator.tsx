/**
 * Tab Navigator
 *
 * Bottom tab navigation with 5 tabs:
 * - Home (Kitchen World)
 * - Shelf (Archive)
 * - Record (Center, emphasized)
 * - Search (Explore)
 * - Settings
 *
 * Per UX spec (01-screen-flows.md §3):
 * - 3 main tabs: Search, Record, Shelf
 * - Settings accessed via header icon on Home
 *
 * For development, we include all 5 as tabs for easy access.
 * Production version should match the 3-tab spec.
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HomeScreen,
  ShelfScreen,
  RecordScreen,
  SearchScreen,
  SettingsScreen,
} from '../screens';
import { theme, footer as footerTokens } from '../tokens';

// ============================================================================
// Types
// ============================================================================

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Record: undefined;
  Shelf: undefined;
  Settings: undefined;
};

// ============================================================================
// Tab Bar
// ============================================================================

interface TabIconProps {
  focused: boolean;
  routeName: keyof RootTabParamList;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, routeName }) => {
  const icons: Record<keyof RootTabParamList, string> = {
    Home: '🏠',
    Search: '🔍',
    Record: '➕',
    Shelf: '📚',
    Settings: '⚙️',
  };

  const labels: Record<keyof RootTabParamList, string> = {
    Home: 'ホーム',
    Search: '探索',
    Record: '記録',
    Shelf: '棚',
    Settings: '設定',
  };

  const isRecord = routeName === 'Record';

  return (
    <View
      style={[
        styles.tabIconContainer,
        isRecord && styles.recordTabContainer,
      ]}
    >
      <Text
        style={[
          styles.tabIcon,
          isRecord && styles.recordTabIcon,
          focused && styles.tabIconActive,
        ]}
      >
        {icons[routeName]}
      </Text>
      <Text
        style={[
          styles.tabLabel,
          focused && styles.tabLabelActive,
        ]}
      >
        {labels[routeName]}
      </Text>
    </View>
  );
};

// ============================================================================
// Navigator
// ============================================================================

const Tab = createBottomTabNavigator<RootTabParamList>();

export const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: footerTokens.background,
            borderTopWidth: footerTokens.borderWidth,
            borderTopColor: footerTokens.borderColor,
            height: footerTokens.height + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              routeName={route.name as keyof RootTabParamList}
            />
          ),
        })}
        initialRouteName="Home"
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          name="Record"
          component={RecordScreen}
        />
        <Tab.Screen name="Shelf" component={ShelfScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xs,
  },
  recordTabContainer: {
    backgroundColor: theme.colors.accent.primary,
    borderRadius: theme.radius.full,
    width: theme.size.tap.recommended,
    height: theme.size.tap.recommended,
    marginTop: -theme.spacing.md,
    // Shadow (explicit for Fabric compatibility)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.8,
  },
  recordTabIcon: {
    opacity: 1,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: theme.textStyles.caption.fontSize,
    fontWeight: theme.textStyles.caption.fontWeight,
    lineHeight: theme.textStyles.caption.lineHeight,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  tabLabelActive: {
    color: theme.colors.accent.primary,
  },
  recordTabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
