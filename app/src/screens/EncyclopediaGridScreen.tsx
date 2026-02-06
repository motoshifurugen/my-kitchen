/**
 * Encyclopedia Grid Screen (S-02b: 図鑑内カード一覧)
 *
 * Shows dish cards filtered by category or favorites.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions, ScrollView } from 'react-native';
import {
  useNavigation,
  useRoute,
  type NavigationProp,
  type RouteProp,
} from '@react-navigation/native';
import { AppShell } from '../components/templates';
import { HeaderBar, EmptyStateBlock, RecipeDetailModal } from '../components/organisms';
import { DishCardSkeleton, EncyclopediaCardItem, getCardDimensions } from '../components/molecules';
import { Text } from '../components/atoms';
import { theme } from '../tokens';
import {
  DishCard,
  DishCategory,
  useArchiveCards,
} from '../features/archive';
import { useGridColumns, useResponsiveLayout } from '../hooks';
import type { ShelfStackParamList } from '../navigation/ShelfNavigator';
import { ENCYCLOPEDIA_CATALOG, type EncyclopediaEntry } from '../features/archive/data/encyclopediaCatalog';

const SKELETON_COUNT = 6;

export const EncyclopediaGridScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ShelfStackParamList>>();
  const route = useRoute<RouteProp<ShelfStackParamList, 'EncyclopediaGrid'>>();
  const { width: screenWidth } = useWindowDimensions();
  const columns = useGridColumns();
  const { pagePaddingX, contentMaxWidth, shouldCenterContent } = useResponsiveLayout();
  const { cardWidth, cardHeight } = getCardDimensions(screenWidth, columns);

  const [selectedCard, setSelectedCard] = useState<DishCard | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { cards, isLoading, showSkeleton } = useArchiveCards();
  const { mode, category, title, openCardId } = route.params;

  const catalogByTitle = useMemo(() => {
    return new Map(ENCYCLOPEDIA_CATALOG.map((entry) => [entry.title, entry]));
  }, []);

  const cardsByTitle = useMemo(() => {
    return new Map(cards.map((card) => [card.title, card]));
  }, [cards]);

  const sortByKana = useCallback(
    (a: { title: string }, b: { title: string }) => a.title.localeCompare(b.title, 'ja'),
    []
  );

  const gridItems = useMemo(() => {
    if (mode === 'favorite') {
      // For favorites, only show cards that are favorited
      return cards
        .filter((card) => card.isFavorite)
        .map((card) => {
          const catalogEntry = catalogByTitle.get(card.title);
          return {
            id: card.id,
            title: card.title,
            icon: catalogEntry?.icon,
            card,
            isEmpty: false,
          };
        })
        .sort(sortByKana);
    }

    if (mode === 'all') {
      // For 'all' mode, show all encyclopedia entries (unlocked state)
      const entries = ENCYCLOPEDIA_CATALOG;
      return entries.map((entry: EncyclopediaEntry) => {
        const card = cardsByTitle.get(entry.title);
        // isEmpty: card doesn't exist OR cookCount is 0 (never cooked)
        const isEmpty = !card || (card.cookCount ?? 0) === 0;
        return {
          id: entry.id,
          title: entry.title,
          icon: entry.icon,
          card: isEmpty ? undefined : card, // Only include card if it has been cooked
          isEmpty,
        };
      });
    }

    // Category mode: show entries for the specific category
    const targetCategory: DishCategory | null = category ?? null;
    const entries = ENCYCLOPEDIA_CATALOG.filter(
      (entry) => !targetCategory || entry.category === targetCategory
    );

    return entries.map((entry: EncyclopediaEntry) => {
      const card = cardsByTitle.get(entry.title);
      // isEmpty: card doesn't exist OR cookCount is 0 (never cooked)
      const isEmpty = !card || (card.cookCount ?? 0) === 0;
      return {
        id: entry.id,
        title: entry.title,
        icon: entry.icon,
        card: isEmpty ? undefined : card, // Only include card if it has been cooked
        isEmpty,
      };
    });
  }, [cardsByTitle, catalogByTitle, category, mode, sortByKana]);

  // Split items into registered (cooked) and unregistered (not cooked yet)
  const { registeredItems, unregisteredItems } = useMemo(() => {
    if (mode === 'favorite') {
      // For favorites, all items are registered (they are favorited)
      return { registeredItems: gridItems, unregisteredItems: [] };
    }

    const registered = gridItems.filter((item) => !item.isEmpty);
    const unregistered = gridItems.filter((item) => item.isEmpty);

    return { registeredItems: registered, unregisteredItems: unregistered };
  }, [gridItems, mode]);

  useEffect(() => {
    if (!openCardId) return;
    const target = cards.find((card) => card.id === openCardId);
    if (target) {
      setSelectedCard(target);
      setIsModalVisible(true);
    }
  }, [cards, openCardId]);

  const handleCardPress = useCallback((item: {
    title: string;
    card?: DishCard;
  }) => {
    if (item.card) {
      setSelectedCard(item.card);
      setIsModalVisible(true);
      return;
    }

    const placeholderCard: DishCard = {
      id: `placeholder-${item.title}`,
      title: item.title,
      cookedAt: '',
      cookCount: 0,
    };
    setSelectedCard(placeholderCard);
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedCard(null), 300);
  }, []);

  // Generate styles with responsive values
  const styles = useMemo(
    () => createStyles(pagePaddingX, contentMaxWidth, shouldCenterContent),
    [pagePaddingX, contentMaxWidth, shouldCenterContent]
  );

  const renderCard = useCallback(
    ({ item }: { item: { id: string; title: string; icon?: EncyclopediaEntry['icon']; card?: DishCard; isEmpty?: boolean } }) => (
      <View style={styles.cardWrapper}>
        <EncyclopediaCardItem
          title={item.title}
          icon={item.icon}
          cookCount={item.card?.cookCount}
          isEmpty={item.isEmpty}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          onPress={() => handleCardPress({ title: item.title, card: item.card })}
          disabled={item.isEmpty}
        />
      </View>
    ),
    [cardWidth, cardHeight, handleCardPress, styles]
  );

  const renderSkeleton = useCallback(
    (index: number) => (
      <View key={index} style={styles.cardWrapper}>
        <DishCardSkeleton cardWidth={cardWidth} cardHeight={cardHeight} />
      </View>
    ),
    [cardWidth, cardHeight, styles]
  );

  const renderSkeletonGrid = () => (
    <View style={styles.grid}>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => renderSkeleton(index))}
    </View>
  );

  const emptyTitle = mode === 'favorite'
    ? 'まだお気に入りはありません。'
    : 'ここは、これから育ちます。';
  const emptySubtitle = '棚は、いつでも静かに待っています。';

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <EmptyStateBlock title={emptyTitle} subtitle={emptySubtitle} />
    </View>
  );

  const renderGridSection = (items: Array<{ id: string; title: string; icon?: EncyclopediaEntry['icon']; card?: DishCard; isEmpty?: boolean }>) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.gridSection}>
        <View style={[styles.gridContent, styles.grid]}>
          {items.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <EncyclopediaCardItem
                title={item.title}
                icon={item.icon}
                cookCount={item.card?.cookCount}
                isEmpty={item.isEmpty}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                onPress={() => handleCardPress({ title: item.title, card: item.card })}
                disabled={item.isEmpty}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <AppShell
      showWorldBackground
      header={
        <HeaderBar
          title={title}
          showBack
          onBack={() => navigation.goBack()}
        />
      }
    >
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* For 'all' and 'category' modes, always show unlocked cards (even while loading) */}
        {/* For 'favorite' mode, show skeleton while loading */}
        {mode === 'favorite' && showSkeleton && renderSkeletonGrid()}
        
        {mode === 'favorite' && !showSkeleton && (
          <>
            {gridItems.length > 0 && (
              <View style={[styles.gridContent, styles.grid]}>
                {gridItems.map((item) => (
                  <View key={item.id} style={styles.cardWrapper}>
                    <EncyclopediaCardItem
                      title={item.title}
                      icon={item.icon}
                      cookCount={item.card?.cookCount}
                      isEmpty={item.isEmpty}
                      cardWidth={cardWidth}
                      cardHeight={cardHeight}
                      onPress={() => handleCardPress({ title: item.title, card: item.card })}
                      disabled={item.isEmpty}
                    />
                  </View>
                ))}
              </View>
            )}
            {gridItems.length === 0 && renderEmptyState()}
          </>
        )}

        {(mode === 'all' || mode === 'category') && (
          <>
            {/* Registered (cooked) items */}
            {registeredItems.length > 0 && renderGridSection(registeredItems)}
            
            {/* Unregistered (not cooked yet) items */}
            {unregisteredItems.length > 0 && (
              <View style={styles.unregisteredSection}>
                <Text variant="caption" style={styles.sectionLabel}>
                  未登録カード
                </Text>
                {renderGridSection(unregisteredItems)}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <RecipeDetailModal
        visible={isModalVisible}
        card={selectedCard}
        onClose={handleCloseModal}
      />
    </AppShell>
  );
};

EncyclopediaGridScreen.displayName = 'EncyclopediaGridScreen';

// Styles are created inside component to use responsive values
const createStyles = (pagePaddingX: number, contentMaxWidth: number, shouldCenterContent: boolean) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
      ...(shouldCenterContent && {
        maxWidth: contentMaxWidth,
        alignSelf: 'center',
        width: '100%',
      }),
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    gridSection: {
      marginBottom: theme.spacing.xl,
    },
    gridContent: {
      paddingHorizontal: pagePaddingX,
      ...(shouldCenterContent && {
        maxWidth: contentMaxWidth,
        alignSelf: 'center',
        width: '100%',
      }),
    },
    row: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    cardWrapper: {
      marginBottom: theme.spacing.sm,
    },
    unregisteredSection: {
      marginTop: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    sectionLabel: {
      color: theme.colors.text.secondary,
      paddingHorizontal: pagePaddingX,
      ...(shouldCenterContent && {
        maxWidth: contentMaxWidth,
        alignSelf: 'center',
        width: '100%',
      }),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: pagePaddingX,
      minHeight: 400,
      ...(shouldCenterContent && {
        maxWidth: contentMaxWidth,
        alignSelf: 'center',
        width: '100%',
      }),
    },
  });
