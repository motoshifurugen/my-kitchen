/**
 * Bookshelf Log Screen (S-02c: 本棚ログ)
 *
 * Shows recent additions/updates in chronological order.
 */

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import { AppShell } from '../components/templates';
import { HeaderBar, EmptyStateBlock, RecipeDetailModal } from '../components/organisms';
import { AppImage, Icon, PressableBase, Surface, Text } from '../components/atoms';
import { theme } from '../tokens';
import type { ShelfStackParamList } from '../navigation/ShelfNavigator';
import { formatCookedAt, useArchiveCards, type DishCard } from '../features/archive';
import { ENCYCLOPEDIA_CATALOG } from '../features/archive/data/encyclopediaCatalog';
import { bookshelfRepo, favoritesRepo } from '../repositories';

export const BookshelfLogScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ShelfStackParamList>>();
  const { cards, isLoading, refetch } = useArchiveCards();
  const [selectedCard, setSelectedCard] = useState<DishCard | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [events, setEvents] = useState<Array<{ title: string; occurred_at: string }>>([]);

  const iconMap = useMemo(
    () => new Map(ENCYCLOPEDIA_CATALOG.map((entry) => [entry.title, entry.icon])),
    []
  );

  useEffect(() => {
    let isMounted = true;
    bookshelfRepo.listRecentWithRecipe(50)
      .then((rows) => {
        if (!isMounted) return;
        setEvents(rows.map((row) => ({ title: row.title, occurred_at: row.occurred_at })));
      })
      .catch((error) => {
        console.error('[bookshelf] log load failed', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenCard = useCallback((card: DishCard) => {
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

  return (
    <AppShell
      showWorldBackground
      header={
        <HeaderBar
          title="本棚ログ"
          showBack
          onBack={() => navigation.goBack()}
        />
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyStateBlock
              title={isLoading ? '準備中です。' : 'まだ静かなままです。'}
              subtitle="記録は、少しずつ増えていきます。"
            />
          </View>
        ) : (
          events.map((event, index) => {
            const matchedCard = cards.find((card) => card.title === event.title);
            return (
            <PressableBase
              key={`${event.title}-${event.occurred_at}-${index}`}
              style={({ pressed }) => [
                styles.logRow,
                pressed && styles.rowPressed,
              ]}
              onPress={() => matchedCard && handleOpenCard(matchedCard)}
              accessibilityLabel={`${event.title}を開く`}
            >
              <Surface rounded="md" padding="md" style={styles.rowSurface}>
                {iconMap.get(event.title) ? (
                  <AppImage
                    source={iconMap.get(event.title)}
                    width={28}
                    height={28}
                    rounded="md"
                    accessibilityLabel={event.title}
                  />
                ) : (
                  <Icon name="Clock" size={18} color={theme.colors.text.tertiary} />
                )}
                <View style={styles.rowText}>
                  <Text variant="body">{event.title}</Text>
                  <Text variant="caption" style={styles.rowCaption}>
                    {formatCookedAt(event.occurred_at)}
                  </Text>
                </View>
                <Icon name="CaretRight" size={18} color={theme.colors.text.tertiary} />
              </Surface>
            </PressableBase>
            );
          })
        )}
      </ScrollView>

      <RecipeDetailModal
        visible={isModalVisible}
        card={selectedCard}
        onClose={handleCloseModal}
        onToggleFavorite={handleToggleFavorite}
      />
    </AppShell>
  );
};

BookshelfLogScreen.displayName = 'BookshelfLogScreen';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  emptyContainer: {
    paddingTop: theme.spacing.xl,
  },
  logRow: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  rowSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.surface.elevated,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowCaption: {
    color: theme.colors.text.tertiary,
  },
  rowPressed: {
    opacity: theme.opacity.pressed,
  },
});
