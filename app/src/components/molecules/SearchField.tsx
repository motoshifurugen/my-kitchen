/**
 * SearchField Molecule
 *
 * Search input with icon and clear button.
 * Commonly used in search/explore screens.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Icon, PressableBase } from '../atoms';
import { colors, radius, spacing, size, typography } from '../../tokens';

export interface SearchFieldProps {
  /** Input value */
  value: string;
  /** Change handler */
  onChangeText: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Submit handler (when user presses return) */
  onSubmit?: () => void;
  /** Clear handler (when clear button pressed) */
  onClear?: () => void;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Accessibility label (defaults to "検索") */
  accessibilityLabel?: string;
  /** Accessibility hint for screen readers */
  accessibilityHint?: string;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChangeText,
  placeholder = '検索...',
  onSubmit,
  onClear,
  autoFocus = false,
  disabled = false,
  accessibilityLabel = '検索',
  accessibilityHint,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = useCallback(() => {
    onChangeText('');
    onClear?.();
  }, [onChangeText, onClear]);

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: isFocused ? colors.border.focused : colors.border.default,
    paddingHorizontal: spacing.md,
    height: size.tap.recommended,
  };

  const showClearButton = value.length > 0 && !disabled;

  return (
    <View style={containerStyle}>
      <Icon
        name="MagnifyingGlass"
        size={20}
        color={colors.icon.default}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        editable={!disabled}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.input}
        allowFontScaling={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
      />
      {showClearButton && (
        <PressableBase
          style={styles.clearButton}
          onPress={handleClear}
          accessibilityLabel="クリア"
          accessibilityRole="button"
        >
          <Icon name="X" size={16} color={colors.icon.default} />
        </PressableBase>
      )}
    </View>
  );
};

SearchField.displayName = 'SearchField';

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    padding: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
});
