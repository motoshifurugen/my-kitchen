/**
 * Tab Navigator
 *
 * Bottom tab navigation with 4 tabs:
 * - Home (Kitchen World) - S-01
 * - Search (Explore) - S-05
 * - Record (Center, emphasized) - S-04
 * - Shelf (Archive) - S-02
 *
 * Per UX spec (01-screen-flows.md §3, §5.1):
 * - Footer shows: 探索, 記録, 棚
 * - Settings accessed via header icon on Home (not in footer)
 * - Navigation from S-02/S-05 back to S-01 via Footer
 *
 * Note: Home tab included for navigation back to S-01 as per transition matrix.
 */

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HomeScreen,
  SearchScreen,
} from '../screens';
import { RecordNavigator } from './RecordNavigator';
import { ShelfNavigator } from './ShelfNavigator';
import { SettingsNavigator } from './SettingsNavigator';
import { Icon, IconName, Text } from '../components/atoms';
import { IconButton } from '../components/molecules';
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
  Record: 'ChefHat',
  Shelf: 'Books',
  Settings: 'SlidersHorizontal',
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
  const isHome = routeName === 'Home';
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
        isRecord ? styles.recordTabContainer : styles.tabIconContainer,
      ]}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
    >
      <Icon
        name={iconName}
        size={isRecord ? 28 : 22}
        color={iconColor}
        weight={focused || isRecord ? 'fill' : 'regular'}
      />
      {!isRecord && !isHome && (
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
// Custom Tab Bar
// ============================================================================

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  // Get Home and Record routes
  const homeRoute = state.routes.find((route) => route.name === 'Home');
  const recordRoute = state.routes.find((route) => route.name === 'Record');

  return (
    <View
      style={[
        styles.customTabBar,
        {
          backgroundColor: footerTokens.background,
          borderTopWidth: footerTokens.borderWidth,
          borderTopColor: footerTokens.borderColor,
          height: footerTokens.height + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Left half: Home button */}
      {homeRoute && (() => {
        const isFocused = state.index === state.routes.findIndex((r) => r.key === homeRoute.key);
        return (
          <TouchableOpacity
            style={styles.halfSection}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={labelMap.Home}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: homeRoute.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(homeRoute.name);
              }
            }}
            activeOpacity={0.7}
          >
            <TabIcon focused={isFocused} routeName="Home" />
          </TouchableOpacity>
        );
      })()}

      {/* Center: Record button (circle only) */}
      {recordRoute && (() => {
        const isFocused = state.index === state.routes.findIndex((r) => r.key === recordRoute.key);
        return (
          <TouchableOpacity
            style={styles.recordButtonContainer}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={labelMap.Record}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: recordRoute.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(recordRoute.name);
              }
            }}
            activeOpacity={0.9}
          >
            <TabIcon focused={isFocused} routeName="Record" />
          </TouchableOpacity>
        );
      })()}

      {/* Right half: Settings button */}
      <TouchableOpacity
        style={styles.halfSection}
        accessibilityRole="button"
        accessibilityLabel="設定"
        onPress={() => {
          // @ts-ignore - navigation type will be set up in TabNavigator
          navigation.navigate('Settings');
        }}
        activeOpacity={0.7}
      >
        <IconButton
          icon="SlidersHorizontal"
          onPress={() => {}}
          accessibilityLabel="設定"
          iconSize={22}
        />
      </TouchableOpacity>
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
            display: 'none', // Hide default tab bar, use custom one
          },
        })}
        tabBar={(props) => <CustomTabBar {...props} />}
        initialRouteName="Home"
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          name="Record"
          component={RecordNavigator}
          options={{
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tab.Screen name="Shelf" component={ShelfNavigator} />
        <Tab.Screen
          name="Settings"
          component={SettingsNavigator}
          options={{
            tabBarButton: () => null, // Hide from tab bar, accessed via footer icon
          }}
        />
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
    width: 72,
    height: 72,
    marginTop: -theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
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
  customTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingTop: theme.spacing.xs,
    position: 'relative',
  },
  halfSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -36, // Half of button width (72 / 2)
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
