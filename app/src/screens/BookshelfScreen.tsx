/**
 * Bookshelf Screen (S-02a: 棚図鑑)
 *
 * Fixed shelf layout with encyclopedia categories, favorites,
 * bookshelf log entry, and a light anniversary highlight.
 */

import React, { useMemo, useState, useCallback, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useFocusEffect, type NavigationProp } from '@react-navigation/native';
import { AppShell } from '../components/templates';
import { HeaderBar, EmptyStateBlock, RecipeDetailModal } from '../components/organisms';
import { AppImage, Icon, PressableBase, Surface, Text } from '../components/atoms';
import { useResponsiveLayout } from '../hooks';
import { theme } from '../tokens';
import type { ShelfStackParamList } from '../navigation/ShelfNavigator';
import { useArchiveCards, sortCardsByDate, type DishCard } from '../features/archive';
import type { DishCategory } from '../features/archive';
import { ENCYCLOPEDIA_CATALOG } from '../features/archive/data/encyclopediaCatalog';
import { favoritesRepo } from '../repositories';
import { getMenuIdByTitle } from '../data/menuCatalog';

const ENCYCLOPEDIA_CATEGORIES = [
  { id: 'soup', label: '汁もの', hint: '湯気のある時間' },
  { id: 'fry', label: '炒め物', hint: '火の気配' },
  { id: 'grillBake', label: '焼き物', hint: '香ばしい記録' },
  { id: 'noodleRice', label: '麺・ごはん', hint: '日々の主役' },
  { id: 'dessertSalad', label: 'デザート・サラダ', hint: '軽やかな余韻' },
] as const;

type EncyclopediaCategory = {
  id: DishCategory;
  label: string;
  hint: string;
};

const encyclopediaCategories: EncyclopediaCategory[] = ENCYCLOPEDIA_CATEGORIES.map((item) => ({
  id: item.id as DishCategory,
  label: item.label,
  hint: item.hint,
}));

export const BookshelfScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ShelfStackParamList>>();
  const { cards, isLoading, refetch } = useArchiveCards();
  const { pagePaddingX, contentMaxWidth, shouldCenterContent } = useResponsiveLayout();
  const [selectedCard, setSelectedCard] = useState<DishCard | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const reopenOnFocusRef = useRef(false);
  const lastSelectedCardRef = useRef<DishCard | null>(null);

  // Get representative menu icon for each category
  const categoryIcons = useMemo(() => {
    const icons: Record<DishCategory, typeof ENCYCLOPEDIA_CATALOG[0]['icon'] | null> = {
      soup: null,
      fry: null,
      grillBake: null,
      noodleRice: null,
      dessertSalad: null,
      other: null,
    };

    encyclopediaCategories.forEach((category) => {
      const categoryMenus = ENCYCLOPEDIA_CATALOG.filter(
        (entry) => entry.category === category.id
      );
      if (categoryMenus.length > 0) {
        // Use the first menu as representative (sorted by kana)
        icons[category.id] = categoryMenus[0].icon;
      }
    });

    return icons;
  }, []);

  const anniversaryCard = useMemo(() => {
    if (cards.length === 0) return null;
    const today = new Date();
    const matches = cards.filter((card) => {
      const cookedDate = new Date(card.cookedAt);
      if (isNaN(cookedDate.getTime())) return false;
      return (
        cookedDate.getMonth() === today.getMonth()
        && cookedDate.getDate() === today.getDate()
      );
    });
    if (matches.length === 0) return null;
    return matches.sort((a, b) => {
      const yearA = new Date(a.cookedAt).getFullYear();
      const yearB = new Date(b.cookedAt).getFullYear();
      return yearB - yearA;
    })[0];
  }, [cards]);

  const handleOpenCategory = (category: DishCategory, title: string) => {
    navigation.navigate('EncyclopediaGrid', {
      title,
      mode: 'category',
      category,
    });
  };

  const handleOpenFavorites = () => {
    navigation.navigate('EncyclopediaGrid', {
      title: 'マイ図鑑',
      mode: 'favorite',
    });
  };

  const handleOpenLog = () => {
    navigation.navigate('BookshelfLog');
  };

  const handleOpenAnniversary = useCallback(() => {
    if (!anniversaryCard) return;
    setSelectedCard(anniversaryCard);
    setIsModalVisible(true);
    lastSelectedCardRef.current = anniversaryCard;
  }, [anniversaryCard]);

  const handleCloseModal = useCallback((preserveCard?: boolean) => {
    setIsModalVisible(false);
    if (!preserveCard) {
      setTimeout(() => setSelectedCard(null), 300);
      lastSelectedCardRef.current = null;
    }
    refetch();
  }, [refetch]);

  const handleOpenRecipe = useCallback((card: DishCard) => {
    reopenOnFocusRef.current = true;
    lastSelectedCardRef.current = card;
    handleCloseModal(true);
    const menuId = getMenuIdByTitle(card.title);
    navigation.navigate('Recipe', { title: card.title, menuId });
  }, [handleCloseModal, navigation]);

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

  useFocusEffect(
    useCallback(() => {
      if (reopenOnFocusRef.current && lastSelectedCardRef.current) {
        setSelectedCard(lastSelectedCardRef.current);
        setIsModalVisible(true);
        reopenOnFocusRef.current = false;
      }
      return undefined;
    }, [])
  );

  return (
    <AppShell
      showWorldBackground
      header={<HeaderBar title="棚" centerTitle />}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: pagePaddingX },
          shouldCenterContent && { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text variant="caption" style={styles.sectionLabel}>
            図鑑
          </Text>
          <View style={styles.encyclopediaGrid}>
            {encyclopediaCategories.map((category) => {
              const categoryIcon = categoryIcons[category.id];
              return (
                <PressableBase
                  key={category.id}
                  style={({ pressed }) => [
                    styles.encyclopediaCard,
                    pressed && styles.encyclopediaPressed,
                  ]}
                  onPress={() => handleOpenCategory(category.id, category.label)}
                  accessibilityLabel={category.label}
                >
                  <Surface rounded="md" padding="sm" style={styles.encyclopediaSurface}>
                    {categoryIcon ? (
                      <AppImage
                        source={categoryIcon}
                        width={22}
                        height={22}
                        rounded="sm"
                        accessibilityLabel={category.label}
                      />
                    ) : (
                      <Icon name="Books" size={22} color={theme.colors.icon.default} />
                    )}
                    <View style={styles.encyclopediaText}>
                      <Text variant="body">{category.label}</Text>
                      <Text variant="caption" style={styles.encyclopediaHint}>
                        {category.hint}
                      </Text>
                    </View>
                  </Surface>
                </PressableBase>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="caption" style={styles.sectionLabel}>
            マイ図鑑
          </Text>
          <PressableBase
            style={({ pressed }) => [
              styles.favoriteCard,
              pressed && styles.encyclopediaPressed,
            ]}
            onPress={handleOpenFavorites}
            accessibilityLabel="マイ図鑑"
          >
            <Surface rounded="md" padding="md" style={styles.favoriteSurface}>
              <Icon name="Heart" size={20} color={theme.colors.accent.primary} />
              <View style={styles.favoriteText}>
                <Text variant="body">大切に残したい料理</Text>
                <Text variant="caption" style={styles.favoriteHint}>
                  お気に入りだけを静かに並べます
                </Text>
              </View>
              <Icon name="CaretRight" size={18} color={theme.colors.text.tertiary} />
            </Surface>
          </PressableBase>
        </View>

        <View style={styles.section}>
          <Text variant="caption" style={styles.sectionLabel}>
            本棚ログ
          </Text>
          <PressableBase
            style={({ pressed }) => [
              styles.logCard,
              pressed && styles.encyclopediaPressed,
            ]}
            onPress={handleOpenLog}
            accessibilityLabel="本棚ログ"
          >
            <Surface rounded="md" padding="md" style={styles.logSurface}>
              <Icon name="Clock" size={20} color={theme.colors.icon.default} />
              <View style={styles.logText}>
                <Text variant="body">最近の追加・更新</Text>
                <Text variant="caption" style={styles.logHint}>
                  そっと増えていく記録
                </Text>
              </View>
              <Icon name="CaretRight" size={18} color={theme.colors.text.tertiary} />
            </Surface>
          </PressableBase>
        </View>

        <View style={styles.section}>
          <Text variant="caption" style={styles.sectionLabel}>
            アニバーサリー
          </Text>
          {anniversaryCard ? (
            <PressableBase
              style={({ pressed }) => [
                styles.anniversaryCard,
                pressed && styles.encyclopediaPressed,
              ]}
              onPress={handleOpenAnniversary}
              accessibilityLabel="アニバーサリー"
            >
              <Surface rounded="md" padding="md" style={styles.anniversarySurface}>
                {anniversaryCard.photoUri ? (
                  <AppImage
                    source={{ uri: anniversaryCard.photoUri }}
                    width={56}
                    height={56}
                    rounded="md"
                    accessibilityLabel={anniversaryCard.title}
                  />
                ) : (
                  <View style={styles.anniversaryPlaceholder}>
                    <Icon name="Calendar" size={20} color={theme.colors.text.tertiary} />
                  </View>
                )}
                <View style={styles.anniversaryText}>
                  <Text variant="body">{anniversaryCard.title}</Text>
                  <Text variant="caption" style={styles.anniversaryHint}>
                    昨年のこの日
                  </Text>
                </View>
                <Icon name="CaretRight" size={18} color={theme.colors.text.tertiary} />
              </Surface>
            </PressableBase>
          ) : (
            <View style={styles.anniversaryEmpty}>
              <EmptyStateBlock
                title={isLoading ? '準備中です。' : 'この日は、まだ静かです。'}
                subtitle="見つかったら、そっと置きます。"
              />
            </View>
          )}
        </View>
      </ScrollView>

      <RecipeDetailModal
        visible={isModalVisible}
        card={selectedCard}
        onClose={() => handleCloseModal(false)}
        onOpenRecipe={handleOpenRecipe}
        onToggleFavorite={handleToggleFavorite}
      />
    </AppShell>
  );
};

BookshelfScreen.displayName = 'BookshelfScreen';

const styles = StyleSheet.create({
  content: {
    // paddingHorizontal is set dynamically via contentContainerStyle
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionLabel: {
    color: theme.colors.text.secondary,
  },
  encyclopediaGrid: {
    gap: theme.spacing.sm,
  },
  encyclopediaCard: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  encyclopediaPressed: {
    opacity: theme.opacity.pressed,
  },
  encyclopediaSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.surface.elevated,
  },
  encyclopediaText: {
    flex: 1,
    gap: 2,
  },
  encyclopediaHint: {
    color: theme.colors.text.tertiary,
  },
  favoriteCard: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  favoriteSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.surface.elevated,
  },
  favoriteText: {
    flex: 1,
    gap: 2,
  },
  favoriteHint: {
    color: theme.colors.text.tertiary,
  },
  logCard: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  logSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.surface.elevated,
  },
  logText: {
    flex: 1,
    gap: 2,
  },
  logHint: {
    color: theme.colors.text.tertiary,
  },
  anniversaryCard: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  anniversarySurface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.surface.elevated,
  },
  anniversaryPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.pressed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anniversaryText: {
    flex: 1,
    gap: 2,
  },
  anniversaryHint: {
    color: theme.colors.text.tertiary,
  },
  anniversaryEmpty: {
    paddingVertical: theme.spacing.md,
  },
});
