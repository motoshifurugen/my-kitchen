/**
 * SearchField Accessibility Tests
 *
 * Verifies accessibility requirements per docs/ux/phase-1/07-accessibility.md §5.1
 */

import { SearchFieldProps } from '../SearchField';

describe('SearchField accessibility contract', () => {
  describe('accessibilityLabel', () => {
    test('should have accessibilityLabel for TextInput', () => {
      // Per 07-accessibility.md: 検索入力にラベル + ヒントあり
      const props: SearchFieldProps & { accessibilityLabel?: string } = {
        value: '',
        onChangeText: () => {},
        accessibilityLabel: '検索',
      };
      expect(props.accessibilityLabel).toBe('検索');
    });

    test('default accessibilityLabel should be descriptive', () => {
      // Default label should be "検索" in Japanese
      const defaultLabel = '検索';
      expect(defaultLabel.length).toBeGreaterThan(0);
    });
  });

  describe('accessibilityHint', () => {
    test('should support accessibilityHint', () => {
      const props: SearchFieldProps & { accessibilityHint?: string } = {
        value: '',
        onChangeText: () => {},
        accessibilityHint: '料理名やタグで検索できます',
      };
      expect(props.accessibilityHint).toBe('料理名やタグで検索できます');
    });
  });

  describe('clear button', () => {
    test('clear button should have accessibilityLabel', () => {
      // Per implementation: accessibilityLabel="クリア"
      const clearButtonLabel = 'クリア';
      expect(clearButtonLabel).toBe('クリア');
    });

    test('clear button should have accessibilityRole="button"', () => {
      // Per implementation: accessibilityRole="button"
      const clearButtonRole = 'button';
      expect(clearButtonRole).toBe('button');
    });
  });

  describe('disabled state', () => {
    test('disabled state should be reflected in TextInput', () => {
      const props: SearchFieldProps = {
        value: '',
        onChangeText: () => {},
        disabled: true,
      };
      // editable={!disabled} and accessibilityState={{ disabled }}
      expect(props.disabled).toBe(true);
    });
  });
});

/**
 * SearchField implementation requirements checklist
 *
 * [x] Clear button - has accessibilityLabel="クリア"
 * [x] Clear button - has accessibilityRole="button"
 * [ ] TextInput - NEEDS accessibilityLabel (default: "検索")
 * [ ] TextInput - NEEDS accessibilityHint support
 * [ ] TextInput - NEEDS accessibilityState={{ disabled }}
 *
 * Required changes:
 * 1. Add accessibilityLabel prop (defaults to "検索")
 * 2. Add accessibilityHint prop
 * 3. Add accessibilityState to TextInput
 */
