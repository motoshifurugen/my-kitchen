/**
 * Search Screen (S-05: 探索)
 *
 * Search and filter through recipe collection.
 */

import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, useWindowDimensions } from 'react-native';
import { Chip, SearchField, getCardDimensions } from '../components/molecules';
import { AppShell } from '../components/templates';
import { HeaderBar, EmptyStateBlock } from '../components/organisms';
import { AppImage, Text } from '../components/atoms';
import { theme } from '../tokens';
import { MENU_CATALOG } from '../data/menuCatalog';
import { useGridColumns, useResponsiveLayout } from '../hooks';

export const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { width: screenWidth } = useWindowDimensions();
  const columns = useGridColumns();
  const { contentMaxWidth, shouldCenterContent } = useResponsiveLayout();
  const { cardWidth, cardHeight } = getCardDimensions(screenWidth, columns);

  const toggleFilter = useCallback((filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  }, []);

  const filteredMenus = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return MENU_CATALOG;
    const lower = query.toLowerCase();
    return MENU_CATALOG.filter((item) =>
      item.label.includes(query) || item.label.toLowerCase().includes(lower)
    );
  }, [searchQuery]);

  const renderMenuItem = useCallback(
    ({ item }: { item: (typeof MENU_CATALOG)[number] }) => (
      <View style={styles.cardWrapper}>
        <View style={[styles.menuCard, { width: cardWidth, height: cardHeight }]}>
          <View style={styles.menuIcon}>
            <AppImage source={item.icon} width={40} height={40} rounded="md" />
          </View>
          <View style={styles.menuInfo}>
            <Text variant="caption" numberOfLines={1} style={styles.menuTitle}>
              {item.label}
            </Text>
          </View>
        </View>
      </View>
    ),
    [cardWidth, cardHeight]
  );

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
      <View style={styles.scrollView}>
        {filteredMenus.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyStateBlock
              icon="MagnifyingGlass"
              title="見つかりませんでした。"
              subtitle="別の言葉で探してみてください。"
            />
          </View>
        ) : (
          <FlatList
            data={filteredMenus}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            numColumns={columns}
            key={columns}
            columnWrapperStyle={columns > 1 ? styles.row : undefined}
            contentContainerStyle={[
              styles.resultsContainer,
              shouldCenterContent && styles.centerContent,
              shouldCenterContent && { maxWidth: contentMaxWidth },
            ]}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
  centerContent: {
    alignSelf: 'center',
    width: '100%',
  },
  row: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  cardWrapper: {
    marginBottom: theme.spacing.sm,
  },
  menuCard: {
    backgroundColor: theme.colors.surface.elevated,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: {
    padding: theme.spacing.sm,
    width: '100%',
  },
  menuTitle: {
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
  },
});
