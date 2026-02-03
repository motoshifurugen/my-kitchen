/**
 * ModalShell Template
 *
 * Full-screen modal layout.
 * Used for flows like S-03 (record completion).
 */

import React from 'react';
import { View, Modal, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar, HeaderBarProps } from '../organisms/HeaderBar';
import { colors } from '../../tokens';

export interface ModalShellProps {
  /** Modal visibility */
  visible: boolean;
  /** Close handler */
  onClose: () => void;
  /** Header configuration */
  header?: Omit<HeaderBarProps, 'showBack' | 'onBack'>;
  /** Children content */
  children: React.ReactNode;
  /** Animation type (default: 'slide') */
  animationType?: 'none' | 'slide' | 'fade';
}

export const ModalShell: React.FC<ModalShellProps> = ({
  visible,
  onClose,
  header,
  children,
  animationType = 'slide',
}) => {
  return (
    <Modal
      visible={visible}
      animationType={animationType}
      onRequestClose={onClose}
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
          {/* Header with close action */}
          {header ? (
            <HeaderBar
              {...header}
              showBack
              onBack={onClose}
            />
          ) : (
            <HeaderBar
              title=""
              showBack
              onBack={onClose}
            />
          )}

          {/* Content */}
          <View style={styles.content}>{children}</View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

ModalShell.displayName = 'ModalShell';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
