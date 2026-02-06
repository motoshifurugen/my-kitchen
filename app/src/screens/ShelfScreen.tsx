/**
 * Shelf Screen (S-02: アーカイブ / 棚図鑑)
 *
 * Displays the recipe card collection in a grid layout.
 * World is visible but blurred in the background.
 */

import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, FlatList, useWindowDimensions } from 'react-native';
import { Text, PressableBase } from '../components/atoms';
import { DishCardItem, DishCardSkeleton, getCardDimensions } from '../components/molecules';
import { AppShell } from '../components/templates';
import { HeaderBar, EmptyStateBlock, RecipeDetailModal } from '../components/organisms';
import { theme } from '../tokens';
import {
  DishCard,
  DishCategory,
  CATEGORY_LABELS,
  useArchiveCards,
  useFilteredCards,
} from '../features/archive';
import { useGridColumns } from '../hooks';
import { favoritesRepo } from '../repositories';

type TabType = 'timeline' | 'category';

// Category tab items for the category view
const CATEGORY_TABS: DishCategory[] = [
  'soup',
  'fry',
  'grillBake',
  'noodleRice',
  'dessertSalad',
];

// Number of skeleton cards to show while loading
const SKELETON_COUNT = 6;

export const ShelfScreen: React.FC = () => {
  const { width: screenWidth } = useWindowDimensions();
  const columns = useGridColumns();
  const { cardWidth, cardHeight } = getCardDimensions(screenWidth, columns);

  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | null>(null);
  const [selectedCard, setSelectedCard] = useState<DishCard | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { cards, isLoading, showSkeleton, refetch } = useArchiveCards();
  const filteredCards = useFilteredCards(cards, {
    category: activeTab === 'category' ? selectedCategory : null,
    sortOrder: 'desc',
  });

  const handleCardPress = useCallback((card: DishCard) => {
    setSelectedCard(card);
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedCard(null), 300);
    refetch();
  }, [refetch]);

  const handleToggleFavorite = useCallback(
    async (cardId: string, isFavorite: boolean) => {
      try {
        await favoritesRepo.setFavorite(cardId, isFavorite);
      } catch (error) {
        if (__DEV__) {
          console.error('[favorite] toggle failed', error);
        }
      }
      refetch();
    },
    [refetch]
  );

  const renderCard = useCallback(
    ({ item }: { item: DishCard }) => (
      <View style={styles.cardWrapper}>
        <DishCardItem
          card={item}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          onPress={handleCardPress}
        />
      </View>
    ),
    [cardWidth, cardHeight, handleCardPress]
  );

  const renderSkeleton = useCallback(
    (index: number) => (
      <View key={index} style={styles.cardWrapper}>
        <DishCardSkeleton cardWidth={cardWidth} cardHeight={cardHeight} />
      </View>
    ),
    [cardWidth, cardHeight]
  );

  const renderSkeletonGrid = () => (
    <View style={styles.grid}>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => renderSkeleton(index))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <EmptyStateBlock
        title="まだ、ここは静かです。"
        subtitle="最初の1枚を、いつでも。"
      />
    </View>
  );

  const renderCategoryTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryTabsContent}
      style={styles.categoryTabs}
    >
      {CATEGORY_TABS.map((category) => (
        <PressableBase
          key={category}
          style={StyleSheet.flatten([
            styles.categoryTab,
            selectedCategory === category ? styles.categoryTabActive : {},
          ])}
          onPress={() => setSelectedCategory(
            selectedCategory === category ? null : category
          )}
          accessibilityLabel={CATEGORY_LABELS[category]}
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedCategory === category }}
        >
          <Text
            variant="caption"
            color={
              selectedCategory === category
                ? theme.colors.surface.elevated
                : theme.colors.text.secondary
            }
          >
            {CATEGORY_LABELS[category]}
          </Text>
        </PressableBase>
      ))}
    </ScrollView>
  );

  const renderContent = () => {
    // Show skeleton during loading if threshold exceeded
    if (showSkeleton) {
      return renderSkeletonGrid();
    }

    // Show empty state if no cards
    if (!isLoading && filteredCards.length === 0) {
      return renderEmptyState();
    }

    // Show grid
    return (
      <FlatList
        data={filteredCards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        key={columns} // Force re-render when column count changes
        columnWrapperStyle={columns > 1 ? styles.row : undefined}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

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
          accessibilityState={{ selected: activeTab === 'timeline' }}
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
          accessibilityState={{ selected: activeTab === 'category' }}
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

      {/* Category filter tabs (only when category tab is active) */}
      {activeTab === 'category' && renderCategoryTabs()}

      {/* Grid Content */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        visible={isModalVisible}
        card={selectedCard}
        onClose={handleCloseModal}
        onToggleFavorite={handleToggleFavorite}
      />
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
  categoryTabs: {
    marginBottom: theme.spacing.md,
  },
  categoryTabsContent: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    gap: theme.spacing.sm,
  },
  categoryTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface.elevated,
  },
  categoryTabActive: {
    backgroundColor: theme.colors.accent.primary,
  },
  contentContainer: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.screen.horizontal,
    gap: theme.spacing.sm,
  },
  gridContent: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingBottom: theme.spacing.xl,
  },
  row: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  cardWrapper: {
    marginBottom: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
  },
});
