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

import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { type NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HomeScreen,
  SearchScreen,
} from '../screens';
import type { RootStackParamList } from './MainNavigator';
import { ShelfNavigator } from './ShelfNavigator';
import { SettingsNavigator } from './SettingsNavigator';
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

const TabIcon: React.FC<TabIconProps> = ({ focused, routeName, onPressIn, onPressOut }) => {
  const isRecord = routeName === 'Record';
  const isHome = routeName === 'Home';
  const isSettings = routeName === 'Settings';
  const iconName = iconMap[routeName];
  const label = labelMap[routeName];

  // Animated value for scale transform (only for record button)
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Handle press in - scale down slightly (only for record button)
  const handlePressIn = useCallback(() => {
    if (isRecord) {
      Animated.timing(scaleAnim, {
        toValue: 0.95, // Slightly smaller when pressed
        duration: duration.feedback.tap, // 100ms
        easing: easing.feedback,
        useNativeDriver: true,
      }).start();
    }
    onPressIn?.();
  }, [scaleAnim, isRecord, onPressIn]);

  // Handle press out - bounce back with slight overshoot (only for record button)
  const handlePressOut = useCallback(() => {
    if (isRecord) {
      // First, scale up slightly (bounce effect)
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05, // Slightly larger for bounce effect
          duration: duration.feedback.tap * 0.6, // 60ms
          easing: easing.celebration, // Bouncy easing
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.0, // Back to normal
          duration: duration.feedback.tap * 0.8, // 80ms
          easing: easing.feedback,
          useNativeDriver: true,
        }),
      ]).start();
    }
    onPressOut?.();
  }, [scaleAnim, isRecord, onPressOut]);

  // Determine icon color based on state
  const iconColor = isRecord
    ? theme.colors.text.inverse
    : focused
      ? theme.colors.accent.primary
      : theme.colors.icon.default;

  const containerStyle = isRecord
    ? [
        styles.recordTabContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]
    : styles.tabIconContainer;

  const ContainerComponent = isRecord ? Animated.View : View;

  return (
    <ContainerComponent
      style={containerStyle}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
    >
      <Icon
        name={iconName}
        size={isRecord ? 32 : 22}
        color={iconColor}
        weight={focused || isRecord ? 'fill' : 'regular'}
      />
      {!isHome && !isSettings && (
        <Text
          variant="caption"
          color={
            isRecord
              ? theme.colors.text.inverse
              : focused
                ? theme.colors.accent.primary
                : theme.colors.text.secondary
          }
          style={styles.tabLabel}
        >
          {label}
        </Text>
      )}
    </ContainerComponent>
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
      {/* Left: Home button */}
      {homeRoute && (() => {
        const isFocused = state.index === state.routes.findIndex((r) => r.key === homeRoute.key);
        return (
          <TouchableOpacity
            style={styles.section}
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
        const rootNavigation = navigation.getParent<NavigationProp<RootStackParamList>>('RootStack');
        return (
          <TouchableOpacity
            style={styles.section}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={labelMap.Record}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: recordRoute.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) return;
              if (rootNavigation) {
                rootNavigation.navigate('RecordFlow');
                return;
              }
              if (!isFocused) {
                navigation.navigate(recordRoute.name);
              }
            }}
            activeOpacity={0.9}
          >
            <TabIcon focused={isFocused} routeName="Record" />
          </TouchableOpacity>
        );
      })()}

      {/* Right: Settings button */}
      {(() => {
        const settingsRoute = state.routes.find((route) => route.name === 'Settings');
        const isFocused = settingsRoute
          ? state.index === state.routes.findIndex((r) => r.key === settingsRoute.key)
          : false;
        return (
          <TouchableOpacity
            style={styles.section}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel="設定"
            onPress={() => {
              // @ts-ignore - navigation type will be set up in TabNavigator
              navigation.navigate('Settings');
            }}
            activeOpacity={0.7}
          >
            <TabIcon focused={isFocused} routeName="Settings" />
          </TouchableOpacity>
        );
      })()}
    </View>
  );
};

// ============================================================================
// Navigator
// ============================================================================

const Tab = createBottomTabNavigator<RootTabParamList>();

const RecordPlaceholderScreen: React.FC = () => {
  return <View style={styles.placeholder} />;
};

RecordPlaceholderScreen.displayName = 'RecordPlaceholderScreen';

export const TabNavigator: React.FC = () => {
  return (
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
      <Tab.Screen name="Record" component={RecordPlaceholderScreen} />
      <Tab.Screen name="Shelf" component={ShelfNavigator} />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarButton: () => null, // Hide from tab bar, accessed via footer icon
        }}
      />
    </Tab.Navigator>
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
    width: 88,
    minHeight: 88,
    marginTop: -theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    gap: 2, // Smaller gap between icon and label
    // Shadow (explicit for Fabric compatibility)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tabLabel: {
    marginTop: 2, // Smaller margin to match button style
  },
  customTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingTop: theme.spacing.xs,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
});
