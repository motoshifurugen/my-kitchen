/**
 * ModalSheet Organism
 *
 * Bottom sheet modal with scrim overlay.
 * Provides consistent modal presentation across the app.
 */

import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '../molecules';
import { Text } from '../atoms';
import { colors, radius, spacing, size } from '../../tokens';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ModalSheetProps {
  /** Modal visibility */
  visible: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Children content */
  children: React.ReactNode;
  /** Max height as percentage of screen (default: 0.9) */
  maxHeightRatio?: number;
  /** Close on scrim tap (default: true) */
  closeOnScrimTap?: boolean;
  /** Show close button (default: true) */
  showCloseButton?: boolean;
}

export const ModalSheet: React.FC<ModalSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  maxHeightRatio = 0.9,
  closeOnScrimTap = true,
  showCloseButton = true,
}) => {
  const insets = useSafeAreaInsets();

  const handleScrimPress = () => {
    if (closeOnScrimTap) {
      onClose();
    }
  };

  const containerStyle: ViewStyle = {
    maxHeight: SCREEN_HEIGHT * maxHeightRatio,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: insets.bottom + spacing.md,
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Scrim */}
        <Pressable
          style={styles.scrim}
          onPress={handleScrimPress}
          accessibilityRole="button"
          accessibilityLabel="閉じる"
        />

        {/* Sheet Container */}
        <View style={containerStyle}>
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              <View style={styles.headerSpacer} />
              {title && (
                <Text variant="subheading" style={styles.title}>
                  {title}
                </Text>
              )}
              <View style={styles.closeContainer}>
                {showCloseButton && (
                  <IconButton
                    icon="X"
                    onPress={onClose}
                    accessibilityLabel="閉じる"
                  />
                )}
              </View>
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

ModalSheet.displayName = 'ModalSheet';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.scrim,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerSpacer: {
    width: size.tap.recommended,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  closeContainer: {
    width: size.tap.recommended,
    alignItems: 'flex-end',
  },
  content: {
    paddingHorizontal: spacing.screen.horizontal,
  },
});
