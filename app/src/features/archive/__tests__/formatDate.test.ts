/**
 * Date Formatting Utilities Tests
 *
 * Tests for archive-specific date formatting.
 */

import { formatCookedAt } from '../utils';

describe('formatCookedAt', () => {
  it('formats ISO date to Japanese display format', () => {
    const result = formatCookedAt('2024-03-15T10:30:00.000Z');
    // Expected: "2024年3月15日" (or similar Japanese format)
    expect(result).toContain('2024');
    expect(result).toContain('3');
    expect(result).toContain('15');
  });

  it('handles date-only ISO string', () => {
    const result = formatCookedAt('2024-01-01');
    expect(result).toContain('2024');
    expect(result).toContain('1');
  });

  it('returns empty string for invalid date', () => {
    const result = formatCookedAt('invalid-date');
    expect(result).toBe('');
  });

  it('returns empty string for empty input', () => {
    const result = formatCookedAt('');
    expect(result).toBe('');
  });
});
