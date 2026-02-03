/**
 * TextField Molecule
 *
 * Single-line text input with label and optional validation.
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
import { colors, radius, spacing, size, typography, focus } from '../../tokens';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
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
  /** Disabled state */
  disabled?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  hint,
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
    paddingHorizontal: spacing.md,
    height: size.tap.recommended,
    justifyContent: 'center',
  };

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
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          {...rest}
        />
      </View>
      {(error || hint) && (
        <Text
          variant="caption"
          color={error ? colors.semantic.error.text : colors.text.tertiary}
          style={styles.helper}
        >
          {error || hint}
        </Text>
      )}
    </View>
  );
};

TextField.displayName = 'TextField';

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
    padding: 0, // Reset default padding
  },
  helper: {
    marginTop: spacing.xs,
  },
});
