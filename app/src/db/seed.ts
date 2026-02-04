/**
 * Seed Runner
 *
 * Inserts fixed recipes and initializes recipe_cards when empty.
 */

import { execute } from './db';
import { SEED_RECIPES } from './seed_recipes';

const nowIso = () => new Date().toISOString();

const countRecipes = async (): Promise<number> => {
  const result = await execute('SELECT COUNT(*) as count FROM recipes;');
  return result.rows.item(0).count as number;
};

const insertRecipes = async () => {
  for (const recipe of SEED_RECIPES) {
    await execute(
      `
        INSERT OR IGNORE INTO recipes (id, title, category, is_favorite, created_at, updated_at)
        VALUES (?, ?, ?, 0, ?, ?);
      `,
      [recipe.id, recipe.title, recipe.category, nowIso(), nowIso()]
    );
  }
};

const initRecipeCards = async () => {
  for (const recipe of SEED_RECIPES) {
    await execute(
      `
        INSERT OR IGNORE INTO recipe_cards (recipe_id, times_cooked, grade, last_cooked_at, updated_at)
        VALUES (?, 0, 0, NULL, ?);
      `,
      [recipe.id, nowIso()]
    );
  }
};

export const seedRecipesIfNeeded = async () => {
  const total = await countRecipes();
  if (total > 0) {
    console.info('[db] Seed skipped (recipes already exist)');
    return;
  }

  try {
    await insertRecipes();
    await initRecipeCards();
    console.info(`[db] Seed completed: ${SEED_RECIPES.length} recipes`);
  } catch (error) {
    console.error('[db] Seed failed', error);
    throw error;
  }
};
