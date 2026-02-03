/**
 * Search Screen (S-05: 探索)
 *
 * Search and filter through recipe collection.
 */

import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Chip, SearchField } from '../components/molecules';
import { AppShell } from '../components/templates';
import { HeaderBar, EmptyStateBlock } from '../components/organisms';
import { theme } from '../tokens';

export const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <AppShell showWorldBackground>
      {/* Header */}
      <HeaderBar title="探索" centerTitle />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchField
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="料理名で検索..."
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          label="タグ"
          icon="Tag"
          selected={selectedFilters.includes('tag')}
          onPress={() => toggleFilter('tag')}
        />
        <Chip
          label="日付"
          icon="Calendar"
          selected={selectedFilters.includes('date')}
          onPress={() => toggleFilter('date')}
        />
        <Chip
          label="お気に入り"
          icon="Heart"
          selected={selectedFilters.includes('favorite')}
          onPress={() => toggleFilter('favorite')}
        />
      </View>

      {/* Results */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.resultsContainer}
      >
        <EmptyStateBlock
          icon="MagnifyingGlass"
          title="探索をはじめましょう"
          subtitle="料理名やタグで記録を探せます"
        />

        {/* TODO: Search results grid will be rendered here */}
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    marginBottom: theme.spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.screen.horizontal,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  resultsContainer: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingBottom: theme.spacing.xl,
    flexGrow: 1,
  },
});
