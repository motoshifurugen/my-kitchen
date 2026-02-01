/**
 * Search Screen (S-05: 探索)
 *
 * Search and filter through recipe collection.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorldScene } from '../components/world';
import { theme } from '../tokens';

export const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* Blurred World Background */}
      <WorldScene blurred />

      {/* Content */}
      <SafeAreaView edges={['top']} style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>探索</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="料理名で検索..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterChipText}>タグ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterChipText}>日付</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterChipText}>お気に入り</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.resultsContainer}
        >
          {/* Empty State */}
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>探索をはじめましょう</Text>
            <Text style={styles.emptySubtitle}>
              料理名やタグで記録を探せます
            </Text>
          </View>

          {/* TODO: Search results grid will be rendered here */}
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
  searchContainer: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    marginBottom: theme.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.elevated,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    paddingHorizontal: theme.spacing.md,
    height: theme.size.tap.recommended,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.textStyles.body,
    color: theme.colors.text.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.screen.horizontal,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.surface.elevated,
  },
  filterChipText: {
    ...theme.textStyles.caption,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  resultsContainer: {
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
