/**
 * RecipeDetailModal Organism
 *
 * S-03: Recipe card detail modal.
 * Displays dish photo, name, memo, tags, date, and cook count.
 *
 * Animation: Scale (0.95→1) + Fade, 250ms
 * Close: X button (top-left) or scrim tap
 */

import React, { useEffect, useRef } from 'react';
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
import { Text, AppImage } from '../atoms';
import { colors, radius, spacing, size, shadow } from '../../tokens';
import { DishCard } from '../../features/archive/types';
import { formatCookedAt } from '../../features/archive/utils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Modal sizing per spec: width = screen - 40pt, max height = 80-85%
const MODAL_HORIZONTAL_MARGIN = 20;
const MODAL_WIDTH = SCREEN_WIDTH - MODAL_HORIZONTAL_MARGIN * 2;
const MODAL_MAX_HEIGHT = SCREEN_HEIGHT * 0.85;

// Animation config
const ANIMATION_DURATION = 250;

export interface RecipeDetailModalProps {
  /** Modal visibility */
  visible: boolean;
  /** Card data to display */
  card: DishCard | null;
  /** Close handler */
  onClose: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  visible,
  card,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  // Animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  // Run enter/exit animation
  useEffect(() => {
    if (visible && card) {
      // Enter animation
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset for next open
      opacity.setValue(0);
      scale.setValue(0.95);
    }
  }, [visible, card, opacity, scale]);

  // Don't render if not visible or no card
  if (!visible || !card) {
    return null;
  }

  const handleClose = () => {
    // Exit animation then close
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.95,
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

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
              transform: [{ scale }],
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
            {/* Photo or Placeholder */}
            <View style={styles.photoContainer}>
              {card.photoUri ? (
                <AppImage
                  source={{ uri: card.photoUri }}
                  style={styles.photo}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text
                    variant="body"
                    color={colors.text.secondary}
                    style={styles.placeholderText}
                  >
                    写真はまだありません。次に作るときに、追加できます。
                  </Text>
                </View>
              )}
            </View>

            {/* Title */}
            <Text variant="heading" style={styles.title}>
              {card.title}
            </Text>

            {/* Memo */}
            {card.memo && (
              <Text variant="body" color={colors.text.secondary} style={styles.memo}>
                {card.memo}
              </Text>
            )}

            {/* Tags */}
            {card.tags && card.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {card.tags.map((tag, index) => (
                  <Chip key={`${tag}-${index}`} label={tag} disabled />
                ))}
              </View>
            )}

            {/* Metadata: Date & Count */}
            <View style={styles.metaContainer}>
              <Text variant="caption" color={colors.text.tertiary}>
                {formatCookedAt(card.cookedAt)}
              </Text>
              <Text variant="caption" color={colors.text.tertiary}>
                {card.cookCount}回作った
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
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
    // MVP: scrim only, no blur
    // TODO: UX-LATER: world blur backdrop
    backgroundColor: colors.overlay.scrim,
  },
  modalCard: {
    width: MODAL_WIDTH,
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.lg,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.sm + size.tap.recommended, // Space for close button
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  photoContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  placeholderText: {
    textAlign: 'center',
  },
  title: {
    marginBottom: spacing.sm,
  },
  memo: {
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
