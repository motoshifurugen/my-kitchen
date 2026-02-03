/**
 * DishCard Utilities
 *
 * Pure functions for dish card calculations.
 */

// Grid layout constants
const GRID_GAP = 8; // spacing.sm
const SCREEN_PADDING = 20; // spacing.screen.horizontal
const CARD_HEIGHT_RATIO = 1.2;

/**
 * Calculate card dimensions based on screen width and column count.
 */
export function getCardDimensions(
  screenWidth: number,
  columns: number
): { cardWidth: number; cardHeight: number } {
  const availableWidth = screenWidth - SCREEN_PADDING * 2;
  const totalGap = GRID_GAP * (columns - 1);
  const cardWidth = (availableWidth - totalGap) / columns;
  const cardHeight = cardWidth * CARD_HEIGHT_RATIO;

  return { cardWidth, cardHeight };
}
