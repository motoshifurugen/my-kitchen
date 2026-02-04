import { execute } from '../db';
import type { DishCardRow, RecipeCardRow } from './types';

export const cardsRepo = {
  async listAll(): Promise<DishCardRow[]> {
    const result = await execute(
      `
        SELECT
          recipes.id as id,
          recipes.title as title,
          recipes.category as category,
          recipes.is_favorite as is_favorite,
          recipes.created_at as created_at,
          recipes.updated_at as updated_at,
          recipe_cards.recipe_id as recipe_id,
          recipe_cards.times_cooked as times_cooked,
          recipe_cards.grade as grade,
          recipe_cards.last_cooked_at as last_cooked_at,
          recipe_cards.updated_at as card_updated_at
        FROM recipes
        LEFT JOIN recipe_cards ON recipe_cards.recipe_id = recipes.id
        ORDER BY recipes.title ASC;
      `
    );
    const rows: DishCardRow[] = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      const row = result.rows.item(i);
      rows.push({
        ...row,
        updated_at: row.card_updated_at ?? row.updated_at,
      } as DishCardRow);
    }
    return rows;
  },

  async listByCategory(category: string): Promise<DishCardRow[]> {
    const result = await execute(
      `
        SELECT
          recipes.id as id,
          recipes.title as title,
          recipes.category as category,
          recipes.is_favorite as is_favorite,
          recipes.created_at as created_at,
          recipes.updated_at as updated_at,
          recipe_cards.recipe_id as recipe_id,
          recipe_cards.times_cooked as times_cooked,
          recipe_cards.grade as grade,
          recipe_cards.last_cooked_at as last_cooked_at,
          recipe_cards.updated_at as card_updated_at
        FROM recipes
        LEFT JOIN recipe_cards ON recipe_cards.recipe_id = recipes.id
        WHERE recipes.category = ?
        ORDER BY recipes.title ASC;
      `,
      [category]
    );
    const rows: DishCardRow[] = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      const row = result.rows.item(i);
      rows.push({
        ...row,
        updated_at: row.card_updated_at ?? row.updated_at,
      } as DishCardRow);
    }
    return rows;
  },

  async listFavorites(): Promise<DishCardRow[]> {
    const result = await execute(
      `
        SELECT
          recipes.id as id,
          recipes.title as title,
          recipes.category as category,
          recipes.is_favorite as is_favorite,
          recipes.created_at as created_at,
          recipes.updated_at as updated_at,
          recipe_cards.recipe_id as recipe_id,
          recipe_cards.times_cooked as times_cooked,
          recipe_cards.grade as grade,
          recipe_cards.last_cooked_at as last_cooked_at,
          recipe_cards.updated_at as card_updated_at
        FROM recipes
        LEFT JOIN recipe_cards ON recipe_cards.recipe_id = recipes.id
        WHERE recipes.is_favorite = 1
        ORDER BY recipes.title ASC;
      `
    );
    const rows: DishCardRow[] = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      const row = result.rows.item(i);
      rows.push({
        ...row,
        updated_at: row.card_updated_at ?? row.updated_at,
      } as DishCardRow);
    }
    return rows;
  },

  async getCardByRecipeId(recipeId: string): Promise<RecipeCardRow | null> {
    const result = await execute('SELECT * FROM recipe_cards WHERE recipe_id = ?;', [recipeId]);
    if (result.rows.length === 0) return null;
    return result.rows.item(0) as RecipeCardRow;
  },

  async upsertCard(card: RecipeCardRow): Promise<void> {
    await execute(
      `
        INSERT INTO recipe_cards (recipe_id, times_cooked, grade, last_cooked_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(recipe_id) DO UPDATE SET
          times_cooked = excluded.times_cooked,
          grade = excluded.grade,
          last_cooked_at = excluded.last_cooked_at,
          updated_at = excluded.updated_at;
      `,
      [
        card.recipe_id,
        card.times_cooked,
        card.grade,
        card.last_cooked_at,
        card.updated_at,
      ]
    );
  },
};
