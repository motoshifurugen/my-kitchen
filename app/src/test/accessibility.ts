/**
 * Accessibility Test Utilities
 *
 * Helper functions for testing React Native accessibility properties.
 * Based on requirements from docs/ux/phase-1/07-accessibility.md §9.
 */

import { ReactTestInstance } from 'react-test-renderer';

/**
 * Assert that a component has an accessibilityLabel
 */
export const expectAccessibilityLabel = (
  element: ReactTestInstance,
  expectedLabel?: string
): void => {
  const label = element.props.accessibilityLabel;
  expect(label).toBeDefined();
  expect(typeof label).toBe('string');
  expect(label.length).toBeGreaterThan(0);

  if (expectedLabel !== undefined) {
    expect(label).toBe(expectedLabel);
  }
};

/**
 * Assert that a component has an accessibilityHint
 */
export const expectAccessibilityHint = (
  element: ReactTestInstance,
  expectedHint?: string
): void => {
  const hint = element.props.accessibilityHint;
  expect(hint).toBeDefined();
  expect(typeof hint).toBe('string');
  expect(hint.length).toBeGreaterThan(0);

  if (expectedHint !== undefined) {
    expect(hint).toBe(expectedHint);
  }
};

/**
 * Assert that a component has a specific accessibilityRole
 */
export const expectAccessibilityRole = (
  element: ReactTestInstance,
  expectedRole: string
): void => {
  expect(element.props.accessibilityRole).toBe(expectedRole);
};

/**
 * Assert that a component has specific accessibilityState properties
 */
export const expectAccessibilityState = (
  element: ReactTestInstance,
  expectedState: Partial<{
    disabled: boolean;
    selected: boolean;
    checked: boolean | 'mixed';
    busy: boolean;
    expanded: boolean;
  }>
): void => {
  const state = element.props.accessibilityState;
  expect(state).toBeDefined();
  expect(state).toMatchObject(expectedState);
};

/**
 * Assert that a component is hidden from accessibility
 * (for decorative elements)
 */
export const expectAccessibilityHidden = (element: ReactTestInstance): void => {
  // React Native uses accessibilityElementsHidden or importantForAccessibility
  const isHidden =
    element.props.accessibilityElementsHidden === true ||
    element.props.importantForAccessibility === 'no' ||
    element.props.importantForAccessibility === 'no-hide-descendants';

  expect(isHidden).toBe(true);
};

/**
 * Assert that a component is NOT hidden from accessibility
 */
export const expectAccessibilityVisible = (element: ReactTestInstance): void => {
  const isHidden =
    element.props.accessibilityElementsHidden === true ||
    element.props.importantForAccessibility === 'no' ||
    element.props.importantForAccessibility === 'no-hide-descendants';

  expect(isHidden).toBe(false);
};
