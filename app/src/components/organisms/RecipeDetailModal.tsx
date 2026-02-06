/**
 * RecipeDetailModal Organism
 *
 * S-03: Recipe card detail modal.
 * Displays 2.5D menu icon, name, action row (recipe/favorite),
 * and collapsed log view (latest + summary + expand).
 *
 * Design: "棚のカードを手に取った" — a card picked from the shelf.
 * Photo is NOT the hero; the menu icon is the main visual.
 *
 * Animation: Scale (0.95→1) + Fade, 250ms
 * Close: X button (top-left) or scrim tap
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton, Chip } from '../molecules';
import { Text, AppImage, Icon, PressableBase } from '../atoms';
import { useIsReducedMotion } from '../../hooks/useReducedMotion';
import { colors, radius, spacing, size, shadow } from '../../tokens';
import { DishCard } from '../../features/archive/types';
import { formatCookedAt } from '../../features/archive/utils';
import { logsRepo } from '../../repositories';
import type { CookLogRow } from '../../repositories';
import { getMenuIconSource } from '../../data/menuCatalog';
import { MENU_ICONS } from '../../assets/manifest';
import { getLatestLog, getRecentDates, getSortedLogs, getSummaryText } from './recipeDetailHelpers';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Modal sizing per spec: width = screen - 40pt, max height = 80-85%
const MODAL_HORIZONTAL_MARGIN = 20;
const MODAL_WIDTH = SCREEN_WIDTH - MODAL_HORIZONTAL_MARGIN * 2;
const MODAL_MAX_HEIGHT = SCREEN_HEIGHT * 0.85;

// Menu icon display size in modal (larger than grid for visibility)
const MENU_ICON_SIZE = 80;

// TODO: Replace with dedicated _fallback@2x.webp asset
// See: app/assets/menu-icons/_fallback@2x.webp
const FALLBACK_ICON = MENU_ICONS.menu_onigiri;

// Animation config
const ANIMATION_DURATION = 250;

export interface RecipeDetailModalProps {
  /** Modal visibility */
  visible: boolean;
  /** Card data to display */
  card: DishCard | null;
  /** Close handler */
  onClose: () => void;
  /** Favorite toggle handler (optimistic UI) */
  onToggleFavorite?: (cardId: string, isFavorite: boolean) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  visible,
  card,
  onClose,
  onToggleFavorite,
}) => {
  const insets = useSafeAreaInsets();
  const reduceMotionEnabled = useIsReducedMotion();
  const [logs, setLogs] = useState<CookLogRow[]>([]);
  const [photoPreviewUri, setPhotoPreviewUri] = useState<string | null>(null);
  const [interactionReady, setInteractionReady] = useState(false);
  const [logsExpanded, setLogsExpanded] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(false);

  // Animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  // Sync local favorite state with card prop
  useEffect(() => {
    if (card) {
      setLocalFavorite(card.isFavorite ?? false);
    }
  }, [card]);

  // Reset expanded state when modal opens
  useEffect(() => {
    if (visible && card) {
      setLogsExpanded(false);
    }
  }, [visible, card]);

  // Run enter/exit animation
  useEffect(() => {
    if (visible && card) {
      setInteractionReady(false);
      const interactionTimer = setTimeout(() => {
        setInteractionReady(true);
      }, 200);

      const animations = [
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ];

      if (!reduceMotionEnabled) {
        animations.push(
          Animated.timing(scale, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        );
      } else {
        scale.setValue(1);
      }

      Animated.parallel(animations).start();

      return () => clearTimeout(interactionTimer);
    } else {
      opacity.setValue(0);
      scale.setValue(reduceMotionEnabled ? 1 : 0.95);
      setInteractionReady(false);
    }
  }, [visible, card, opacity, scale, reduceMotionEnabled]);

  useEffect(() => {
    let isMounted = true;
    if (visible && card) {
      logsRepo
        .listByRecipe(card.id)
        .then((rows) => {
          if (!isMounted) return;
          setLogs(rows);
        })
        .catch((error) => {
          if (__DEV__) {
            console.error('[recipe] logs load failed', error);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [visible, card]);

  // Derived data
  const menuIcon = useMemo(() => {
    if (!card) return FALLBACK_ICON;
    return getMenuIconSource(card.title) ?? FALLBACK_ICON;
  }, [card]);

  const latestLog = useMemo(() => getLatestLog(logs), [logs]);
  const summary = useMemo(() => getSummaryText(logs), [logs]);
  const recentDates = useMemo(() => getRecentDates(logs, 3), [logs]);

  // Sorted logs for expanded view
  const sortedLogs = useMemo(() => getSortedLogs(logs), [logs]);

  if (!visible || !card) {
    return null;
  }

  const handleClose = () => {
    if (!interactionReady) return;
    const animations = [
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ];

    if (!reduceMotionEnabled) {
      animations.push(
        Animated.timing(scale, {
          toValue: 0.95,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start(() => {
      onClose();
    });
  };

  const handleToggleFavorite = () => {
    if (!card) return;
    const nextValue = !localFavorite;
    setLocalFavorite(nextValue);
    onToggleFavorite?.(card.id, nextValue);
  };

  // TODO: Wire to recipe screen navigation or external URL
  const handleRecipePress = () => {
    // no-op placeholder
  };

  // --- Log row rendering ---

  const renderLogRow = (log: CookLogRow) => (
    <View key={log.id} style={styles.logRow}>
      <View style={styles.logContentRow}>
        {log.photo_uri ? (
          <PressableBase
            style={styles.logPhotoButton}
            onPress={() => setPhotoPreviewUri(log.photo_uri ?? null)}
            accessibilityLabel="写真を拡大"
            accessibilityRole="button"
          >
            <AppImage
              source={{ uri: log.photo_uri }}
              width={56}
              height={56}
              rounded="md"
              contentFit="cover"
              accessibilityLabel={`${card.title}の写真`}
            />
          </PressableBase>
        ) : (
          <View style={styles.logPhotoPlaceholder}>
            <Icon name="Image" size={20} color={colors.icon.disabled} />
          </View>
        )}
        <View style={styles.logTextColumn}>
          <Text variant="caption" color={colors.text.tertiary}>
            {formatCookedAt(log.cooked_at)}
          </Text>
          {log.memo ? (
            <Text
              variant="body"
              color={colors.text.secondary}
              numberOfLines={3}
              style={styles.logMemo}
            >
              {log.memo}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Scrim (tap to close) */}
        <Pressable
          testID="modal-scrim"
          style={styles.scrim}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="閉じる"
        />

        {/* Modal Card */}
        <Animated.View
          testID="recipe-detail-modal"
          accessibilityViewIsModal={true}
          style={[
            styles.modalCard,
            {
              opacity,
              transform: reduceMotionEnabled ? [] : [{ scale }],
              maxHeight: MODAL_MAX_HEIGHT - insets.top - insets.bottom,
            },
          ]}
        >
          {/* Close Button (top-left) */}
          <View style={styles.closeButtonContainer}>
            <IconButton
              icon="X"
              onPress={handleClose}
              accessibilityLabel="閉じる"
            />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ===== Card Face: Menu Icon + Title ===== */}
            <View style={styles.cardFace}>
              <AppImage
                source={menuIcon}
                width={MENU_ICON_SIZE}
                height={MENU_ICON_SIZE}
                rounded="md"
                contentFit="contain"
                accessibilityLabel={`${card.title}のアイコン`}
              />
              <Text
                variant="heading"
                numberOfLines={2}
                style={styles.cardTitle}
              >
                {card.title}
              </Text>
            </View>

            {/* ===== Action Row: Recipe / Favorite ===== */}
            <View style={styles.actionRow}>
              <PressableBase
                style={styles.actionButton}
                onPress={handleRecipePress}
                accessibilityLabel="レシピを見る"
                accessibilityRole="button"
              >
                <Icon name="Books" size={18} color={colors.text.secondary} />
                <Text variant="caption" color={colors.text.secondary}>
                  レシピ
                </Text>
              </PressableBase>

              <PressableBase
                style={styles.actionButton}
                onPress={handleToggleFavorite}
                accessibilityLabel={
                  localFavorite ? 'お気に入りを解除' : 'お気に入りに追加'
                }
                accessibilityRole="button"
              >
                <Icon
                  name="Heart"
                  size={18}
                  color={localFavorite ? colors.accent.primary : colors.text.secondary}
                  weight={localFavorite ? 'fill' : 'regular'}
                />
                <Text
                  variant="caption"
                  color={localFavorite ? colors.accent.primary : colors.text.secondary}
                >
                  お気に入り
                </Text>
              </PressableBase>
            </View>

            {/* ===== Tags ===== */}
            {card.tags && card.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {card.tags.map((tag, index) => (
                  <Chip key={`${tag}-${index}`} label={tag} disabled />
                ))}
              </View>
            )}

            {/* ===== Log Section ===== */}
            {logs.length > 0 && (
              <View style={styles.logsSection}>
                <Text
                  variant="caption"
                  color={colors.text.secondary}
                  style={styles.logsSectionTitle}
                >
                  記録
                </Text>

                {/* Latest log (always visible) */}
                {latestLog && renderLogRow(latestLog)}

                {/* Summary bar */}
                <View style={styles.summaryBar}>
                  <Text variant="caption" color={colors.text.tertiary}>
                    合計 {summary.totalCount} 回
                  </Text>
                  <Text variant="caption" color={colors.text.tertiary}>
                    最後 {summary.latestDate}
                  </Text>
                </View>

                {/* Recent date chips */}
                {recentDates.length > 1 && (
                  <View style={styles.recentChips}>
                    {recentDates.slice(1).map((date, i) => (
                      <View key={i} style={styles.dateChip}>
                        <Text variant="caption" color={colors.text.tertiary}>
                          {date}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Expand / Collapse toggle */}
                {logs.length > 1 && (
                  <>
                    <PressableBase
                      style={styles.expandButton}
                      onPress={() => setLogsExpanded((prev) => !prev)}
                      accessibilityLabel={
                        logsExpanded ? '記録を閉じる' : 'すべての記録を見る'
                      }
                      accessibilityRole="button"
                    >
                      <Text variant="caption" color={colors.text.link}>
                        {logsExpanded ? '閉じる' : 'すべて見る'}
                      </Text>
                    </PressableBase>

                    {/* Expanded log list */}
                    {logsExpanded &&
                      sortedLogs.slice(1).map((log) => renderLogRow(log))}
                  </>
                )}
              </View>
            )}

            {/* Empty log state (quiet) */}
            {logs.length === 0 && card.cookCount === 0 && (
              <View style={styles.emptyLogHint}>
                <Text variant="caption" color={colors.text.tertiary}>
                  ここに記録が並びます。
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>

      {/* Photo Preview Modal */}
      <Modal
        visible={Boolean(photoPreviewUri)}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoPreviewUri(null)}
      >
        <Pressable
          style={styles.previewBackdrop}
          onPress={() => setPhotoPreviewUri(null)}
          accessibilityRole="button"
          accessibilityLabel="閉じる"
        >
          {photoPreviewUri ? (
            <AppImage
              source={{ uri: photoPreviewUri }}
              style={styles.previewImage}
              contentFit="contain"
              accessibilityLabel="拡大写真"
            />
          ) : null}
        </Pressable>
      </Modal>
    </Modal>
  );
};

RecipeDetailModal.displayName = 'RecipeDetailModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.scrim,
    zIndex: 1,
    elevation: 1,
  },
  modalCard: {
    width: MODAL_WIDTH,
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.lg,
    minHeight: 240,
    alignSelf: 'center',
    zIndex: 2,
    elevation: 2,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 10,
  },
  scrollView: {
    maxHeight: MODAL_MAX_HEIGHT,
  },
  scrollContent: {
    paddingTop: spacing.sm + size.tap.recommended,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },

  // Card face
  cardFace: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    textAlign: 'center',
  },

  // Action row
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },

  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  // Logs section
  logsSection: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  logsSectionTitle: {
    marginBottom: spacing.xs,
  },
  logRow: {
    gap: spacing.xs,
  },
  logContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  logPhotoButton: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  logPhotoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logTextColumn: {
    flex: 1,
    gap: 2,
  },
  logMemo: {
    lineHeight: 20,
  },

  // Summary bar
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },

  // Recent date chips
  recentChips: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  dateChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.background.secondary,
  },

  // Expand button
  expandButton: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },

  // Empty log hint (quiet)
  emptyLogHint: {
    marginTop: spacing.md,
    alignItems: 'center',
  },

  // Photo preview
  previewBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
  },
});
