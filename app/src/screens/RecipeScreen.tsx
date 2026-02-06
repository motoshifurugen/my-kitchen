/**
 * Recipe Screen (S-03a: レシピ)
 *
 * Shows a fixed 3-step recipe for a dish.
 */

import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  type NavigationProp,
  type RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppShell } from '../components/templates';
import { HeaderBar } from '../components/organisms';
import { AppImage, Icon, Surface, Text } from '../components/atoms';
import { colors, radius, size, spacing } from '../tokens';
import type { ShelfStackParamList } from '../navigation/ShelfNavigator';
import { MENU_ICONS } from '../assets/manifest';
import { MENU_FALLBACK_KEY, getMenuIdByTitle } from '../data/menuCatalog';
import {
  getRecipeSteps,
  type RecipeStep,
  type RecipeStepGenre,
} from '../data/recipeCatalog';

type RecipeScreenRoute = RouteProp<ShelfStackParamList, 'Recipe'>;

const STEP_META: Record<RecipeStepGenre, { label: string; icon: React.ComponentProps<typeof Icon>['name'] }> = {
  prep: { label: '下ごしらえ', icon: 'Knife' },
  heat: { label: '火入れ', icon: 'Fire' },
  finish: { label: '仕上げ', icon: 'Sparkle' },
};

const MENU_ICON_SIZE = 56;

export const RecipeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ShelfStackParamList>>();
  const route = useRoute<RecipeScreenRoute>();
  const { title, menuId: menuIdParam } = route.params;

  const resolvedMenuId = useMemo(() => {
    return menuIdParam ?? getMenuIdByTitle(title);
  }, [menuIdParam, title]);

  const menuIcon =
    MENU_ICONS[resolvedMenuId ?? MENU_FALLBACK_KEY] ?? MENU_ICONS[MENU_FALLBACK_KEY];

  const { steps, isFallback } = useMemo(() => getRecipeSteps(resolvedMenuId), [resolvedMenuId]);

  const renderStep = (step: RecipeStep, index: number) => {
    const meta = STEP_META[step.genre];
    return (
      <Surface key={`${step.genre}-${index}`} rounded="md" style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <View style={styles.stepIcon}>
            <Icon name={meta.icon} size={20} color={colors.icon.default} />
          </View>
          <View style={styles.stepTitle}>
            <Text variant="caption" color={colors.text.tertiary}>
              {meta.label}
            </Text>
            <Text variant="subheading">{step.title}</Text>
          </View>
        </View>
        <Text variant="body" color={colors.text.secondary} style={styles.stepBody}>
          {step.body}
        </Text>
      </Surface>
    );
  };

  return (
    <AppShell
      showWorldBackground
      header={
        <HeaderBar
          title="レシピ"
          showBack
          onBack={() => navigation.goBack()}
        />
      }
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Surface rounded="lg" elevation="sm" style={styles.heroCard}>
          <AppImage
            source={menuIcon}
            width={MENU_ICON_SIZE}
            height={MENU_ICON_SIZE}
            rounded="md"
            contentFit="contain"
            accessibilityLabel={`${title}のアイコン`}
          />
          <View style={styles.heroText}>
            <Text variant="caption" color={colors.text.tertiary}>
              料理
            </Text>
            <Text variant="subheading">{title}</Text>
          </View>
        </Surface>

        <View style={styles.sectionHeader}>
          <Text variant="caption" color={colors.text.secondary}>
            3つの手順
          </Text>
          {isFallback && (
            <Text variant="caption" color={colors.text.tertiary}>
              この料理は、3つの手順だけ書いてあります。
            </Text>
          )}
        </View>

        <View style={styles.steps}>{steps.map(renderStep)}</View>
      </ScrollView>
    </AppShell>
  );
};

RecipeScreen.displayName = 'RecipeScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  heroText: {
    flex: 1,
    gap: 2,
  },
  sectionHeader: {
    gap: 4,
  },
  steps: {
    gap: spacing.sm,
  },
  stepCard: {
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  stepIcon: {
    width: size.tap.minimum,
    height: size.tap.minimum,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.elevated,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  stepTitle: {
    flex: 1,
    gap: 2,
  },
  stepBody: {
    lineHeight: 22,
  },
});
