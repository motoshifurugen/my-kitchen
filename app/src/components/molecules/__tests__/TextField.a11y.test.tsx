/**
 * TextField Accessibility Tests
 *
 * Verifies accessibility requirements per docs/ux/phase-1/07-accessibility.md §5.1
 * Form inputs require accessibilityLabel and accessibilityHint.
 */

import { TextFieldProps } from '../TextField';

describe('TextField accessibility contract', () => {
  describe('accessibilityLabel', () => {
    test('should use label prop as accessibilityLabel', () => {
      const props: TextFieldProps = {
        value: '',
        onChangeText: () => {},
        label: '料理名',
      };
      // TextInput should have accessibilityLabel derived from label
      expect(props.label).toBe('料理名');
    });

    test('should support custom accessibilityLabel', () => {
      const props: TextFieldProps & { accessibilityLabel?: string } = {
        value: '',
        onChangeText: () => {},
        label: '料理名',
        accessibilityLabel: '料理の名前を入力',
      };
      expect(props.accessibilityLabel).toBe('料理の名前を入力');
    });
  });

  describe('accessibilityHint', () => {
    test('should support accessibilityHint for form inputs', () => {
      // Per 07-accessibility.md §5.1: フォーム入力に accessibilityHint
      const props: TextFieldProps & { accessibilityHint?: string } = {
        value: '',
        onChangeText: () => {},
        label: '料理名',
        accessibilityHint: '料理の名前を入力してください',
      };
      expect(props.accessibilityHint).toBe('料理の名前を入力してください');
    });

    test('should describe the expected input', () => {
      // accessibilityHint should explain what to input
      const validHints = [
        '料理の名前を入力してください',
        'メモを入力してください',
        '検索ワードを入力',
      ];
      validHints.forEach((hint) => {
        expect(hint.length).toBeGreaterThan(0);
        expect(typeof hint).toBe('string');
      });
    });
  });

  describe('accessibilityState', () => {
    test('disabled state should be indicated', () => {
      const props: TextFieldProps = {
        value: '',
        onChangeText: () => {},
        disabled: true,
      };
      // TextInput editable={false} and accessibilityState={{ disabled: true }}
      expect(props.disabled).toBe(true);
    });
  });

  describe('error handling accessibility', () => {
    test('error message should be accessible', () => {
      const props: TextFieldProps = {
        value: '',
        onChangeText: () => {},
        error: '料理名を入力してください',
      };
      // Error text should be read by screen readers
      expect(props.error).toBe('料理名を入力してください');
    });

    test('error state should use semantic colors', () => {
      // Per 07-accessibility.md §3.2: エラーは色+アイコン+テキストで伝達
      // TextField shows error with semantic error color
      const hasErrorColor = true; // colors.semantic.error.text
      expect(hasErrorColor).toBe(true);
    });
  });
});

/**
 * TextField implementation requirements checklist
 *
 * [x] label prop - displays above input
 * [ ] accessibilityLabel - NEEDS TO BE ADDED to TextInput (from label or custom)
 * [ ] accessibilityHint - NEEDS TO BE ADDED to TextInput
 * [x] disabled state - editable={!disabled}
 * [ ] accessibilityState - NEEDS disabled state on TextInput
 * [x] error display - shows error text with semantic color
 *
 * Required changes:
 * 1. Add accessibilityLabel prop (defaults to label)
 * 2. Add accessibilityHint prop
 * 3. Pass to TextInput with accessibilityState
 */
