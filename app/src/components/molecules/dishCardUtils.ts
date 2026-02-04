/**
 * DishCard Utilities
 *
 * Pure functions for dish card calculations.
 */

import { getPagePaddingX, getScreenClass } from '../../hooks/useResponsiveLayout';

// Grid layout constants
const GRID_GAP = 8; // spacing.sm
const CARD_HEIGHT_RATIO = 1.2;

/**
 * Calculate card dimensions based on screen width and column count.
 * Uses responsive padding based on screen class.
 */
export function getCardDimensions(
  screenWidth: number,
  columns: number
): { cardWidth: number; cardHeight: number } {
  const screenClass = getScreenClass(screenWidth);
  const pagePaddingX = getPagePaddingX(screenClass);
  const availableWidth = screenWidth - pagePaddingX * 2;
  const totalGap = GRID_GAP * (columns - 1);
  const cardWidth = (availableWidth - totalGap) / columns;
  const cardHeight = cardWidth * CARD_HEIGHT_RATIO;

  return { cardWidth, cardHeight };
}
