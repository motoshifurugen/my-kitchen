/**
 * TextArea Molecule
 *
 * Multi-line text input with label and optional validation.
 * Uses design tokens for consistent styling.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Text } from '../atoms';
import { colors, radius, spacing, typography } from '../../tokens';

export interface TextAreaProps extends Omit<TextInputProps, 'style' | 'multiline'> {
  /** Input value */
  value: string;
  /** Change handler */
  onChangeText: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label above the input */
  label?: string;
  /** Error message (shows error state) */
  error?: string;
  /** Hint text below input */
  hint?: string;
  /** Number of visible lines (default: 4) */
  numberOfLines?: number;
  /** Maximum character count */
  maxLength?: number;
  /** Show character count */
  showCharacterCount?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  hint,
  numberOfLines = 4,
  maxLength,
  showCharacterCount = false,
  disabled = false,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(
    (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const getBorderColor = () => {
    if (error) return colors.semantic.error.border;
    if (isFocused) return colors.border.focused;
    if (disabled) return colors.border.disabled;
    return colors.border.default;
  };

  const inputContainerStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: getBorderColor(),
    borderRadius: radius.md,
    backgroundColor: disabled ? colors.background.secondary : colors.surface.elevated,
    padding: spacing.md,
    minHeight: numberOfLines * 24, // Approximate line height
  };

  const characterCount = maxLength
    ? `${value.length}/${maxLength}`
    : `${value.length}`;

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="caption" color={colors.text.secondary} style={styles.label}>
          {label}
        </Text>
      )}
      <View style={inputContainerStyle}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          editable={!disabled}
          multiline
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          textAlignVertical="top"
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          {...rest}
        />
      </View>
      <View style={styles.footer}>
        {(error || hint) && (
          <Text
            variant="caption"
            color={error ? colors.semantic.error.text : colors.text.tertiary}
          >
            {error || hint}
          </Text>
        )}
        {showCharacterCount && (
          <Text variant="caption" color={colors.text.tertiary} style={styles.charCount}>
            {characterCount}
          </Text>
        )}
      </View>
    </View>
  );
};

TextArea.displayName = 'TextArea';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    fontSize: typography.size.md,
    color: colors.text.primary,
    padding: 0,
    lineHeight: typography.size.md * typography.lineHeight.normal,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  charCount: {
    marginLeft: 'auto',
  },
});
