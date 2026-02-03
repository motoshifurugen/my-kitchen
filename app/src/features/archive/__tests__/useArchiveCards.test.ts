/**
 * useArchiveCards Hook Tests
 *
 * Tests for archive cards data fetching hook.
 */

import { filterCardsByCategory, sortCardsByDate } from '../hooks';
import { DishCard } from '../types';

const mockCards: DishCard[] = [
  {
    id: '1',
    title: '肉じゃが',
    cookedAt: '2024-03-15T18:00:00.000Z',
    cookCount: 5,
    category: 'other',
  },
  {
    id: '2',
    title: 'カレーライス',
    cookedAt: '2024-03-10T12:00:00.000Z',
    cookCount: 3,
    category: 'noodleRice',
  },
  {
    id: '3',
    title: '味噌汁',
    cookedAt: '2024-03-20T08:00:00.000Z',
    cookCount: 10,
    category: 'soup',
    isFavorite: true,
  },
];

describe('filterCardsByCategory', () => {
  it('returns all cards when category is null', () => {
    const result = filterCardsByCategory(mockCards, null);
    expect(result).toHaveLength(3);
  });

  it('filters cards by specific category', () => {
    const result = filterCardsByCategory(mockCards, 'soup');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('味噌汁');
  });

  it('returns empty array when no cards match category', () => {
    const result = filterCardsByCategory(mockCards, 'fry');
    expect(result).toHaveLength(0);
  });

  it('filters favorites when category is "favorite"', () => {
    const result = filterCardsByCategory(mockCards, 'favorite');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('味噌汁');
  });
});

describe('sortCardsByDate', () => {
  it('sorts cards by cookedAt descending (newest first)', () => {
    const result = sortCardsByDate(mockCards, 'desc');
    expect(result[0].title).toBe('味噌汁'); // 2024-03-20
    expect(result[1].title).toBe('肉じゃが'); // 2024-03-15
    expect(result[2].title).toBe('カレーライス'); // 2024-03-10
  });

  it('sorts cards by cookedAt ascending (oldest first)', () => {
    const result = sortCardsByDate(mockCards, 'asc');
    expect(result[0].title).toBe('カレーライス'); // 2024-03-10
    expect(result[1].title).toBe('肉じゃが'); // 2024-03-15
    expect(result[2].title).toBe('味噌汁'); // 2024-03-20
  });

  it('does not mutate original array', () => {
    const original = [...mockCards];
    sortCardsByDate(mockCards, 'desc');
    expect(mockCards[0].id).toBe(original[0].id);
  });
});
