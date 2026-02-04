import { execute } from '../db';
import type { CookLogRow } from './types';

export const logsRepo = {
  async insert(log: CookLogRow): Promise<void> {
    await execute(
      `
        INSERT INTO cook_logs (id, recipe_id, cooked_at, memo, photo_uri, tags, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [
        log.id,
        log.recipe_id,
        log.cooked_at,
        log.memo,
        log.photo_uri,
        log.tags,
        log.created_at,
      ]
    );
  },

  async listByRecipe(recipeId: string): Promise<CookLogRow[]> {
    const result = await execute(
      'SELECT * FROM cook_logs WHERE recipe_id = ? ORDER BY cooked_at DESC;',
      [recipeId]
    );
    const rows: CookLogRow[] = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      rows.push(result.rows.item(i) as CookLogRow);
    }
    return rows;
  },

  async listAll(): Promise<CookLogRow[]> {
    const result = await execute('SELECT * FROM cook_logs ORDER BY cooked_at DESC;');
    const rows: CookLogRow[] = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      rows.push(result.rows.item(i) as CookLogRow);
    }
    return rows;
  },
};
