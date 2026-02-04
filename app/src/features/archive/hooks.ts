/**
 * Archive Feature Hooks
 *
 * Data fetching and filtering hooks for the archive feature.
 */

import { useState, useEffect, useMemo } from 'react';
import { DishCard, DishCategory } from './types';
import { cardsRepo } from '../../repositories';

// Skeleton display threshold (ms)
const SKELETON_DELAY = 900;

// Simulated loading delay for development (ms) - set to 0 in production
const DEV_LOADING_DELAY = 0;

/**
 * Filter cards by category.
 * Returns all cards if category is null.
 * Special case: 'favorite' returns only favorited cards.
 */
export function filterCardsByCategory(
  cards: DishCard[],
  category: DishCategory | 'favorite' | null
): DishCard[] {
  if (category === null) {
    return cards;
  }
  if (category === 'favorite') {
    return cards.filter((card) => card.isFavorite);
  }
  return cards.filter((card) => card.category === category);
}

/**
 * Sort cards by cooked date.
 * Does not mutate the original array.
 */
export function sortCardsByDate(
  cards: DishCard[],
  order: 'asc' | 'desc'
): DishCard[] {
  return [...cards].sort((a, b) => {
    const dateA = new Date(a.cookedAt).getTime();
    const dateB = new Date(b.cookedAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

export interface UseArchiveCardsResult {
  /** All cards (unfiltered) */
  cards: DishCard[];
  /** Whether data is loading */
  isLoading: boolean;
  /** Whether skeleton should be shown (loading > 900ms) */
  showSkeleton: boolean;
  /** Error if any */
  error: Error | null;
}

/**
 * Hook to fetch and manage archive cards.
 * Currently uses mock data; will be replaced with actual data source.
 */
export function useArchiveCards(): UseArchiveCardsResult {
  const [cards, setCards] = useState<DishCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let skeletonTimer: NodeJS.Timeout | undefined;
    let isMounted = true;

    // Start skeleton timer
    skeletonTimer = setTimeout(() => {
      if (isMounted && isLoading) {
        setShowSkeleton(true);
      }
    }, SKELETON_DELAY);

    const fetchData = async () => {
      try {
        if (DEV_LOADING_DELAY > 0) {
          await new Promise((resolve) => setTimeout(resolve, DEV_LOADING_DELAY));
        }

        const rows = await cardsRepo.listAll();
        if (!isMounted) return;

        const mapped: DishCard[] = rows.map((row) => ({
          id: row.id,
          title: row.title,
          cookedAt: row.last_cooked_at ?? '',
          cookCount: row.times_cooked ?? 0,
          category: row.category ?? undefined,
          isFavorite: row.is_favorite === 1,
        }));

        setCards(mapped);
        setIsLoading(false);
        setShowSkeleton(false);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load cards'));
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      if (skeletonTimer) {
        clearTimeout(skeletonTimer);
      }
    };
  }, []);

  return { cards, isLoading, showSkeleton, error };
}

export interface UseFilteredCardsOptions {
  category: DishCategory | 'favorite' | null;
  sortOrder: 'asc' | 'desc';
}

/**
 * Hook to get filtered and sorted cards.
 */
export function useFilteredCards(
  cards: DishCard[],
  options: UseFilteredCardsOptions
): DishCard[] {
  return useMemo(() => {
    const filtered = filterCardsByCategory(cards, options.category);
    return sortCardsByDate(filtered, options.sortOrder);
  }, [cards, options.category, options.sortOrder]);
}
