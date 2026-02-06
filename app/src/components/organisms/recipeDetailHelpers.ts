/**
 * RecipeDetailModal Helpers
 *
 * Pure functions for log sorting, summarization, and display logic.
 * Extracted from RecipeDetailModal for testability.
 */

import type { CookLogRow } from '../../repositories';
import { formatCookedAt } from '../../features/archive/utils';

/**
 * Get the latest (most recent) log entry.
 * Sorts by cooked_at desc to be safe even if input is unsorted.
 */
export function getLatestLog(logs: CookLogRow[]): CookLogRow | null {
  if (logs.length === 0) return null;
  const sorted = [...logs].sort(
    (a, b) => new Date(b.cooked_at).getTime() - new Date(a.cooked_at).getTime()
  );
  return sorted[0];
}

/**
 * Sort logs by cooked_at descending (newest first).
 * Returns a new array; does not mutate the input.
 */
export function getSortedLogs(logs: CookLogRow[]): CookLogRow[] {
  if (logs.length === 0) return [];
  return [...logs].sort(
    (a, b) => new Date(b.cooked_at).getTime() - new Date(a.cooked_at).getTime()
  );
}

/**
 * Get recent formatted dates (for chip display).
 * Returns up to `count` formatted date strings, newest first.
 */
export function getRecentDates(logs: CookLogRow[], count: number): string[] {
  if (logs.length === 0) return [];
  const sorted = [...logs].sort(
    (a, b) => new Date(b.cooked_at).getTime() - new Date(a.cooked_at).getTime()
  );
  return sorted.slice(0, count).map((log) => formatCookedAt(log.cooked_at));
}

/**
 * Get summary information for the log section.
 */
export function getSummaryText(logs: CookLogRow[]): {
  totalCount: number;
  latestDate: string;
} {
  if (logs.length === 0) {
    return { totalCount: 0, latestDate: '' };
  }
  const latest = getLatestLog(logs);
  return {
    totalCount: logs.length,
    latestDate: latest ? formatCookedAt(latest.cooked_at) : '',
  };
}
