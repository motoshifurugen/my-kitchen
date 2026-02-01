/**
 * Home Screen (S-01: トップ画面)
 *
 * The kitchen world view. This is the main entry point showing
 * the 2.5D kitchen scene with ambient animations.
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WorldScene } from '../components/world';
import { theme, commonStyles } from '../tokens';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Kitchen World */}
      <WorldScene />

      {/* Header with Settings Icon */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            // Navigate to settings
            // @ts-ignore - navigation type will be set up in TabNavigator
            navigation.navigate('Settings');
          }}
          accessibilityLabel="設定"
          accessibilityRole="button"
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingTop: theme.spacing.sm,
  },
  settingsButton: {
    width: theme.size.tap.recommended,
    height: theme.size.tap.recommended,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },
});
