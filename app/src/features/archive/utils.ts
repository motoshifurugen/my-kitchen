/**
 * Archive Feature Utilities
 *
 * Helper functions for the archive (shelf) feature.
 */

/**
 * Format ISO date string to Japanese display format.
 *
 * @param isoDate - ISO 8601 date string (e.g., "2024-03-15T18:30:00.000Z")
 * @returns Formatted date string (e.g., "2024年3月15日") or empty string if invalid
 */
export function formatCookedAt(isoDate: string): string {
  if (!isoDate) {
    return '';
  }

  const date = new Date(isoDate);

  // Check for invalid date
  if (isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}年${month}月${day}日`;
}
