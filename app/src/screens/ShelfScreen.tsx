/**
 * Shelf Screen (S-02: アーカイブ / 棚図鑑)
 *
 * Displays the recipe card collection in a grid layout.
 * World is visible but blurred in the background.
 */

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorldScene } from '../components/world';
import { theme, commonStyles } from '../tokens';

export const ShelfScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Blurred World Background */}
      <WorldScene blurred />

      {/* Content */}
      <SafeAreaView edges={['top']} style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>アーカイブ</Text>
        </View>

        {/* Tab Bar (時系列 | カテゴリ) */}
        <View style={styles.tabBar}>
          <View style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>時系列</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>カテゴリ</Text>
          </View>
        </View>

        {/* Grid Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.gridContainer}
        >
          {/* Empty State */}
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>まだ記録がありません</Text>
            <Text style={styles.emptySubtitle}>
              料理を記録すると、ここに並びます
            </Text>
          </View>

          {/* TODO: Recipe cards grid will be rendered here */}
        </ScrollView>
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
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingVertical: theme.spacing.md,
  },
  title: {
    ...theme.textStyles.heading,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.screen.horizontal,
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.accent.primary,
  },
  tabText: {
    ...theme.textStyles.body,
    color: theme.colors.text.secondary,
  },
  tabTextActive: {
    color: theme.colors.accent.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingBottom: theme.spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
  },
  emptyTitle: {
    ...theme.textStyles.subheading,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    ...theme.textStyles.body,
    color: theme.colors.text.tertiary,
  },
});
