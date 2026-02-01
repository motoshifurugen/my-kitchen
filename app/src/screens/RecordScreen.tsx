/**
 * Record Screen (S-04: 記録フロー)
 *
 * Entry point for recording a new recipe.
 * Shows photo selection options.
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WorldScene } from '../components/world';
import { theme } from '../tokens';

export const RecordScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Blurred World Background */}
      <WorldScene blurred />

      {/* Content */}
      <SafeAreaView edges={['top']} style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="閉じる"
            accessibilityRole="button"
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>記録する</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Photo Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>📷 写真を撮る</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>🖼 ライブラリから選ぶ</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.textButton}>
            <Text style={styles.textButtonText}>写真なしで続ける</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            写真はあとからでも追加できます
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingVertical: theme.spacing.md,
  },
  closeButton: {
    width: theme.size.tap.minimum,
    height: theme.size.tap.minimum,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: theme.colors.text.primary,
  },
  title: {
    ...theme.textStyles.heading,
  },
  headerSpacer: {
    width: theme.size.tap.minimum,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
  },
  primaryButton: {
    backgroundColor: theme.colors.accent.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  primaryButtonText: {
    ...theme.textStyles.button,
    color: theme.colors.text.inverse,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface.elevated,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    marginBottom: theme.spacing.lg,
  },
  secondaryButtonText: {
    ...theme.textStyles.button,
    color: theme.colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.lg,
  },
  textButton: {
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  textButtonText: {
    ...theme.textStyles.body,
    color: theme.colors.text.link,
  },
  hint: {
    ...theme.textStyles.caption,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});
