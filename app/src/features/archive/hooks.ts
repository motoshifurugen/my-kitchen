/**
 * Archive Feature Hooks
 *
 * Data fetching and filtering hooks for the archive feature.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
  /** Refetch data from database (Issue #156) */
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage archive cards.
 * Supports refetching data when screen gains focus (Issue #156).
 */
export function useArchiveCards(): UseArchiveCardsResult {
  const [cards, setCards] = useState<DishCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasLoadedRef = useRef(false);

  // Shared fetch logic used by initial load and refetch
  const fetchCards = useCallback(async (showLoadingState: boolean) => {
    try {
      if (showLoadingState && DEV_LOADING_DELAY > 0) {
        await new Promise((resolve) => setTimeout(resolve, DEV_LOADING_DELAY));
      }

      const rows = await cardsRepo.listAll();

      const mapped: DishCard[] = rows.map((row) => ({
        id: row.id,
        title: row.title,
        cookedAt: row.last_cooked_at ?? '',
        cookCount: row.times_cooked ?? 0,
        category: (row.category as DishCategory) ?? undefined,
        isFavorite: row.is_favorite === 1,
      }));

      setCards(mapped);
      setError(null);

      if (showLoadingState) {
        setIsLoading(false);
        setShowSkeleton(false);
      }
      hasLoadedRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load cards'));
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  }, []);

  // Refetch function for screen focus (Issue #156)
  // Silent refresh - doesn't show loading/skeleton state
  const refetch = useCallback(async () => {
    await fetchCards(false);
  }, [fetchCards]);

  // Initial data load on mount
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      if (!isMounted) return;
      await fetchCards(true);
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [fetchCards]);

  // Skeleton timer tied to loading state
  useEffect(() => {
    let skeletonTimer: NodeJS.Timeout | undefined;

    if (isLoading) {
      skeletonTimer = setTimeout(() => {
        setShowSkeleton(true);
      }, SKELETON_DELAY);
    } else {
      setShowSkeleton(false);
    }

    return () => {
      if (skeletonTimer) {
        clearTimeout(skeletonTimer);
      }
    };
  }, [isLoading]);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedRef.current) return undefined;
      refetch();
      return undefined;
    }, [refetch])
  );

  return { cards, isLoading, showSkeleton, error, refetch };
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
