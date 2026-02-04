/**
 * Seed Recipes
 *
 * Fixed recipe catalog used to initialize the database.
 */

import { ENCYCLOPEDIA_CATALOG } from '../features/archive/data/encyclopediaCatalog';

export type SeedRecipe = {
  id: string;
  title: string;
  category: string;
};

export const SEED_RECIPES: SeedRecipe[] = ENCYCLOPEDIA_CATALOG.map((entry) => ({
  id: entry.id,
  title: entry.title,
  category: entry.category,
}));
