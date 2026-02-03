/**
 * AppShell Template
 *
 * Standard screen layout with:
 * - Optional blurred world background
 * - Header slot
 * - Content area
 * - Optional footer
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorldScene } from '../world';
import { colors, spacing } from '../../tokens';

export interface AppShellProps {
  /** Show blurred world background */
  showWorldBackground?: boolean;
  /** Header content (or use HeaderBar organism) */
  header?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Safe area edges to handle (default: ['top']) */
  safeAreaEdges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  /** Content padding (default: none - components handle their own) */
  contentPadding?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  showWorldBackground = false,
  header,
  children,
  footer,
  safeAreaEdges = ['top'],
  contentPadding = false,
}) => {
  const contentStyle: ViewStyle = contentPadding
    ? styles.contentWithPadding
    : styles.content;

  return (
    <View style={styles.container}>
      {/* World Background */}
      {showWorldBackground && <WorldScene blurred />}

      {/* Main Layout */}
      <SafeAreaView edges={safeAreaEdges} style={styles.safeArea}>
        {/* Header */}
        {header}

        {/* Content */}
        <View style={contentStyle}>{children}</View>

        {/* Footer */}
        {footer}
      </SafeAreaView>
    </View>
  );
};

AppShell.displayName = 'AppShell';

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
  contentWithPadding: {
    flex: 1,
    paddingHorizontal: spacing.screen.horizontal,
  },
});
