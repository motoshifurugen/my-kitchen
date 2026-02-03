/**
 * Shelf Screen (S-02: アーカイブ / 棚図鑑)
 *
 * Displays the recipe card collection in a grid layout.
 * World is visible but blurred in the background.
 */

import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, PressableBase } from '../components/atoms';
import { AppShell } from '../components/templates';
import { HeaderBar, EmptyStateBlock } from '../components/organisms';
import { theme } from '../tokens';

type TabType = 'timeline' | 'category';

export const ShelfScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('timeline');

  return (
    <AppShell showWorldBackground>
      {/* Header */}
      <HeaderBar title="アーカイブ" centerTitle />

      {/* Tab Bar (時系列 | カテゴリ) */}
      <View style={styles.tabBar}>
        <PressableBase
          style={StyleSheet.flatten([
            styles.tab,
            activeTab === 'timeline' ? styles.tabActive : {},
          ])}
          onPress={() => setActiveTab('timeline')}
          accessibilityLabel="時系列"
          accessibilityRole="tab"
        >
          <Text
            variant="body"
            color={activeTab === 'timeline' ? theme.colors.accent.primary : theme.colors.text.secondary}
            style={activeTab === 'timeline' ? styles.tabTextActive : undefined}
          >
            時系列
          </Text>
        </PressableBase>
        <PressableBase
          style={StyleSheet.flatten([
            styles.tab,
            activeTab === 'category' ? styles.tabActive : {},
          ])}
          onPress={() => setActiveTab('category')}
          accessibilityLabel="カテゴリ"
          accessibilityRole="tab"
        >
          <Text
            variant="body"
            color={activeTab === 'category' ? theme.colors.accent.primary : theme.colors.text.secondary}
            style={activeTab === 'category' ? styles.tabTextActive : undefined}
          >
            カテゴリ
          </Text>
        </PressableBase>
      </View>

      {/* Grid Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
      >
        <EmptyStateBlock
          title="まだ記録がありません"
          subtitle="料理を記録すると、ここに並びます"
        />

        {/* TODO: Recipe cards grid will be rendered here */}
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
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
  tabTextActive: {
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingBottom: theme.spacing.xl,
    flexGrow: 1,
  },
});
