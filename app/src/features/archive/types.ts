/**
 * Archive Feature Types
 *
 * UI-focused data types for the archive (shelf) feature.
 * These are display DTOs, not persistence models.
 */

/**
 * Dish category for archive organization.
 * Fixed categories for MVP (no auto-classification).
 */
export type DishCategory =
  | 'soup'
  | 'fry'
  | 'grillBake'
  | 'noodleRice'
  | 'dessertSalad'
  | 'other';

/**
 * Category display labels (Japanese).
 */
export const CATEGORY_LABELS: Record<DishCategory, string> = {
  soup: '汁物',
  fry: '炒め物',
  grillBake: '焼き物',
  noodleRice: '麺・ごはん',
  dessertSalad: 'デザート・サラダ',
  other: 'その他',
};

/**
 * DishCard - Represents a single recipe card in the archive
 *
 * Designed as a minimal UI DTO:
 * - ID is required for list rendering
 * - Only display-relevant properties
 * - No persistence/DB concerns
 */
export interface DishCard {
  /** Unique identifier */
  id: string;
  /** Dish name / title */
  title: string;
  /** Photo URI (optional - photo may not exist) */
  photoUri?: string;
  /** User's memo / notes */
  memo?: string;
  /** Tags associated with this dish */
  tags?: string[];
  /** When this dish was cooked (ISO 8601 format) */
  cookedAt: string;
  /** Number of times this dish has been cooked */
  cookCount: number;
  /** Category for organization */
  category?: DishCategory;
  /** User's favorite */
  isFavorite?: boolean;
}
