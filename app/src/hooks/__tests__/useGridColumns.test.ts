/**
 * useGridColumns Hook Tests
 *
 * Tests for responsive grid column calculation.
 */

import { getGridColumns } from '../useGridColumns';

describe('getGridColumns', () => {
  describe('Compact (<360)', () => {
    it('returns 2 columns for width 320', () => {
      expect(getGridColumns(320)).toBe(2);
    });

    it('returns 2 columns for width 359', () => {
      expect(getGridColumns(359)).toBe(2);
    });
  });

  describe('Regular/Large Phone (360-767)', () => {
    it('returns 3 columns for width 360', () => {
      expect(getGridColumns(360)).toBe(3);
    });

    it('returns 3 columns for width 430', () => {
      expect(getGridColumns(430)).toBe(3);
    });

    it('returns 3 columns for width 767', () => {
      expect(getGridColumns(767)).toBe(3);
    });
  });

  describe('Tablet (>=768)', () => {
    it('returns 4 columns for width 768', () => {
      expect(getGridColumns(768)).toBe(4);
    });

    it('returns 4 columns for width 1024', () => {
      expect(getGridColumns(1024)).toBe(4);
    });
  });

  describe('edge cases', () => {
    it('returns 2 columns for width 0', () => {
      expect(getGridColumns(0)).toBe(2);
    });

    it('returns 2 columns for negative width', () => {
      expect(getGridColumns(-100)).toBe(2);
    });
  });
});
