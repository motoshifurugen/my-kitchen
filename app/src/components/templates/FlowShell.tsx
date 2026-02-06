/**
 * FlowShell Template
 *
 * Layout for multi-step flows (like recording).
 * No footer, focused content area.
 */

import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorldScene } from '../world';
import { HeaderBar, HeaderBarProps } from '../organisms/HeaderBar';
import { colors, spacing } from '../../tokens';

export interface FlowShellProps {
  /** Header configuration */
  header: Omit<HeaderBarProps, 'transparent'>;
  /** Main content */
  children: React.ReactNode;
  /** Show blurred world background */
  showWorldBackground?: boolean;
  /** Background color (overrides default when showWorldBackground is false) */
  backgroundColor?: string;
  /** Make content scrollable */
  scrollable?: boolean;
  /** Avoid keyboard (for forms) */
  avoidKeyboard?: boolean;
}

export const FlowShell: React.FC<FlowShellProps> = ({
  header,
  children,
  showWorldBackground = true,
  backgroundColor,
  scrollable = false,
  avoidKeyboard = false,
}) => {
  const ContentWrapper = scrollable ? ScrollView : View;
  const contentWrapperProps = scrollable
    ? {
        contentContainerStyle: styles.scrollContent,
        showsVerticalScrollIndicator: false,
      }
    : {};

  const content = (
    <>
      {/* Header */}
      <HeaderBar
        {...header}
        transparent={showWorldBackground}
        backgroundColor={!showWorldBackground && backgroundColor ? backgroundColor : undefined}
      />

      {/* Content */}
      <ContentWrapper style={styles.content} {...contentWrapperProps}>
        {children}
      </ContentWrapper>
    </>
  );

  const containerStyle = !showWorldBackground && backgroundColor
    ? [styles.container, { backgroundColor }]
    : styles.container;

  return (
    <View style={containerStyle}>
      {/* World Background */}
      {showWorldBackground && <WorldScene blurred />}

      {/* Main Layout */}
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {avoidKeyboard ? (
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {content}
          </KeyboardAvoidingView>
        ) : (
          content
        )}
      </SafeAreaView>
    </View>
  );
};

FlowShell.displayName = 'FlowShell';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screen.horizontal,
  },
});
