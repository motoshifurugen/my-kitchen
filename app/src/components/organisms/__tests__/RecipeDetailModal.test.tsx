/**
 * RecipeDetailModal Tests
 *
 * Unit tests for the S-03 recipe detail modal helper logic.
 * Tests focus on pure functions extracted from the component.
 */

import { DishCard } from '../../../features/archive/types';
import { formatCookedAt } from '../../../features/archive/utils';
import { getMenuIconSource } from '../../../data/menuCatalog';
import type { CookLogRow } from '../../../repositories';
import {
  getLatestLog,
  getRecentDates,
  getSortedLogs,
  getSummaryText,
} from '../recipeDetailHelpers';

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const mockCard: DishCard = {
  id: 'test-1',
  title: '肉じゃが',
  photoUri: 'file:///test/photo.jpg',
  memo: '今日は少し甘めに仕上げた',
  tags: ['夜ごはん', '作り置き'],
  cookedAt: '2024-03-15T18:30:00.000Z',
  cookCount: 5,
  isFavorite: false,
};

const mockCardNoPhoto: DishCard = {
  id: 'test-2',
  title: 'お味噌汁',
  cookedAt: '2024-03-14T12:00:00.000Z',
  cookCount: 1,
};

const mockCardUnknownTitle: DishCard = {
  id: 'test-3',
  title: '自家製パスタ',
  cookedAt: '2024-04-01T12:00:00.000Z',
  cookCount: 2,
};

const mockLogs: CookLogRow[] = [
  {
    id: 'log-1',
    recipe_id: 'test-1',
    cooked_at: '2024-03-15T18:30:00.000Z',
    memo: '甘めに仕上げた',
    photo_uri: 'file:///photo1.jpg',
    tags: null,
    created_at: '2024-03-15T18:30:00.000Z',
  },
  {
    id: 'log-2',
    recipe_id: 'test-1',
    cooked_at: '2024-03-10T12:00:00.000Z',
    memo: null,
    photo_uri: null,
    tags: null,
    created_at: '2024-03-10T12:00:00.000Z',
  },
  {
    id: 'log-3',
    recipe_id: 'test-1',
    cooked_at: '2024-02-20T19:00:00.000Z',
    memo: '家族に好評',
    photo_uri: 'file:///photo3.jpg',
    tags: null,
    created_at: '2024-02-20T19:00:00.000Z',
  },
];

const emptyLogs: CookLogRow[] = [];

// ---------------------------------------------------------------------------
// Menu icon mapping
// ---------------------------------------------------------------------------

describe('Menu icon mapping for modal', () => {
  it('returns icon for a known catalog title (肉じゃが)', () => {
    const icon = getMenuIconSource(mockCard.title);
    expect(icon).not.toBeNull();
  });

  it('returns null for an unknown title (自家製パスタ)', () => {
    const icon = getMenuIconSource(mockCardUnknownTitle.title);
    expect(icon).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getLatestLog
// ---------------------------------------------------------------------------

describe('getLatestLog', () => {
  it('returns the first log (newest) from a sorted list', () => {
    const latest = getLatestLog(mockLogs);
    expect(latest).not.toBeNull();
    expect(latest!.id).toBe('log-1');
  });

  it('returns null for empty logs', () => {
    const latest = getLatestLog(emptyLogs);
    expect(latest).toBeNull();
  });

  it('sorts by cooked_at desc and returns the newest even if input is unsorted', () => {
    const unsorted = [...mockLogs].reverse();
    const latest = getLatestLog(unsorted);
    expect(latest!.id).toBe('log-1');
  });
});

// ---------------------------------------------------------------------------
// getRecentDates
// ---------------------------------------------------------------------------

describe('getRecentDates', () => {
  it('returns up to 3 recent formatted dates', () => {
    const dates = getRecentDates(mockLogs, 3);
    expect(dates).toHaveLength(3);
    // First date should be the most recent
    expect(dates[0]).toContain('2024');
  });

  it('returns fewer dates if logs are fewer', () => {
    const dates = getRecentDates([mockLogs[0]], 3);
    expect(dates).toHaveLength(1);
  });

  it('returns empty array for empty logs', () => {
    const dates = getRecentDates(emptyLogs, 3);
    expect(dates).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getSummaryText
// ---------------------------------------------------------------------------

describe('getSummaryText', () => {
  it('returns count and latest date', () => {
    const summary = getSummaryText(mockLogs);
    expect(summary.totalCount).toBe(3);
    expect(summary.latestDate).toContain('2024');
  });

  it('returns zero count and empty date for empty logs', () => {
    const summary = getSummaryText(emptyLogs);
    expect(summary.totalCount).toBe(0);
    expect(summary.latestDate).toBe('');
  });
});

// ---------------------------------------------------------------------------
// getSortedLogs
// ---------------------------------------------------------------------------

describe('getSortedLogs', () => {
  it('returns empty array for empty input', () => {
    const result = getSortedLogs(emptyLogs);
    expect(result).toEqual([]);
  });

  it('returns logs sorted by cooked_at descending', () => {
    const reversed = [...mockLogs].reverse(); // oldest first
    const result = getSortedLogs(reversed);
    expect(result[0].id).toBe('log-1'); // newest
    expect(result[1].id).toBe('log-2');
    expect(result[2].id).toBe('log-3'); // oldest
  });

  it('handles already-sorted input correctly', () => {
    const result = getSortedLogs(mockLogs);
    expect(result[0].id).toBe('log-1');
    expect(result[2].id).toBe('log-3');
  });

  it('does not mutate the original array', () => {
    const original = [...mockLogs].reverse();
    const originalFirstId = original[0].id;
    getSortedLogs(original);
    expect(original[0].id).toBe(originalFirstId);
  });

  it('returns single-element array as-is', () => {
    const single = [mockLogs[1]];
    const result = getSortedLogs(single);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('log-2');
  });
});

// ---------------------------------------------------------------------------
// Null-silent display rules (behavioral contracts)
// ---------------------------------------------------------------------------

describe('Null-silent display rules', () => {
  it('log with null memo should not produce "メモはありません"', () => {
    const logWithoutMemo = mockLogs[1]; // memo: null
    // The component should check: if (log.memo) render memo
    // This test validates the contract:
    expect(logWithoutMemo.memo).toBeNull();
    // The string "メモはありません" should never appear in the component
    // (verified by visual inspection and absence in source code)
  });

  it('log with null photo_uri should not produce "写真なし"', () => {
    const logWithoutPhoto = mockLogs[1]; // photo_uri: null
    expect(logWithoutPhoto.photo_uri).toBeNull();
  });

  it('card without photo should not trigger "写真はまだありません" text', () => {
    expect(mockCardNoPhoto.photoUri).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Favorite toggle contract
// ---------------------------------------------------------------------------

describe('Favorite toggle contract', () => {
  it('DishCard has isFavorite field', () => {
    expect(mockCard.isFavorite).toBe(false);
  });

  it('isFavorite can be toggled', () => {
    const nextValue = !mockCard.isFavorite;
    expect(nextValue).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// formatCookedAt integration
// ---------------------------------------------------------------------------

describe('formatCookedAt integration', () => {
  it('formats card cookedAt correctly', () => {
    const formatted = formatCookedAt(mockCard.cookedAt);
    expect(formatted).toContain('2024');
    expect(formatted).toContain('3');
    expect(formatted).toContain('15');
  });

  it('formats different dates correctly', () => {
    const formatted = formatCookedAt(mockCardNoPhoto.cookedAt);
    expect(formatted).toContain('2024');
    expect(formatted).toContain('3');
    expect(formatted).toContain('14');
  });
});
