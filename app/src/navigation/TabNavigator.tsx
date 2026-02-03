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
import { StyleSheet, View } from 'react-native';
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
import { Icon, IconName, Text } from '../components/atoms';
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

const iconMap: Record<keyof RootTabParamList, IconName> = {
  Home: 'House',
  Search: 'MagnifyingGlass',
  Record: 'Plus',
  Shelf: 'Books',
  Settings: 'Gear',
};

const labelMap: Record<keyof RootTabParamList, string> = {
  Home: 'ホーム',
  Search: '探索',
  Record: '記録',
  Shelf: '棚',
  Settings: '設定',
};

const TabIcon: React.FC<TabIconProps> = ({ focused, routeName }) => {
  const isRecord = routeName === 'Record';
  const iconName = iconMap[routeName];
  const label = labelMap[routeName];

  // Determine icon color based on state
  const iconColor = isRecord
    ? theme.colors.text.inverse
    : focused
      ? theme.colors.accent.primary
      : theme.colors.icon.default;

  return (
    <View
      style={[
        styles.tabIconContainer,
        isRecord && styles.recordTabContainer,
      ]}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
    >
      <Icon
        name={iconName}
        size={isRecord ? 24 : 22}
        color={iconColor}
        weight={focused || isRecord ? 'fill' : 'regular'}
      />
      {!isRecord && (
        <Text
          variant="caption"
          color={focused ? theme.colors.accent.primary : theme.colors.text.secondary}
          style={styles.tabLabel}
        >
          {label}
        </Text>
      )}
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
  tabLabel: {
    marginTop: theme.spacing.xs,
  },
});
