/**
 * EmptyStateBlock Organism
 *
 * Gentle empty state display with optional action.
 * Uses world-bible microcopy style: soft, non-pressuring.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Spacer, Icon, IconName } from '../atoms';
import { Button, ButtonVariant } from '../molecules';
import { colors, spacing } from '../../tokens';

export interface EmptyStateBlockProps {
  /** Main message (gentle, encouraging) */
  title: string;
  /** Secondary explanation */
  subtitle?: string;
  /** Optional icon to display */
  icon?: IconName;
  /** Optional action button label */
  actionLabel?: string;
  /** Action button handler */
  onAction?: () => void;
  /** Action button variant */
  actionVariant?: ButtonVariant;
}

export const EmptyStateBlock: React.FC<EmptyStateBlockProps> = ({
  title,
  subtitle,
  icon,
  actionLabel,
  onAction,
  actionVariant = 'secondary',
}) => {
  return (
    <View style={styles.container}>
      {icon && (
        <>
          <Icon name={icon} size={48} color={colors.text.tertiary} />
          <Spacer size="md" />
        </>
      )}

      <Text
        variant="subheading"
        color={colors.text.secondary}
        style={styles.title}
      >
        {title}
      </Text>

      {subtitle && (
        <>
          <Spacer size="sm" />
          <Text
            variant="body"
            color={colors.text.tertiary}
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        </>
      )}

      {actionLabel && onAction && (
        <>
          <Spacer size="lg" />
          <Button
            label={actionLabel}
            variant={actionVariant}
            onPress={onAction}
          />
        </>
      )}
    </View>
  );
};

EmptyStateBlock.displayName = 'EmptyStateBlock';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.lg,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
});
