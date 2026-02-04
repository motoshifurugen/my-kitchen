import { execute } from '../db';
import type { RecipeRow } from './types';

export const recipesRepo = {
  async listAll(): Promise<RecipeRow[]> {
    const result = await execute('SELECT * FROM recipes ORDER BY title ASC;');
    const rows: RecipeRow[] = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      rows.push(result.rows.item(i) as RecipeRow);
    }
    return rows;
  },

  async getById(id: string): Promise<RecipeRow | null> {
    const result = await execute('SELECT * FROM recipes WHERE id = ?;', [id]);
    if (result.rows.length === 0) return null;
    return result.rows.item(0) as RecipeRow;
  },

  async getByTitle(title: string): Promise<RecipeRow | null> {
    const result = await execute('SELECT * FROM recipes WHERE title = ?;', [title]);
    if (result.rows.length === 0) return null;
    return result.rows.item(0) as RecipeRow;
  },

  async searchByTitle(query: string): Promise<RecipeRow[]> {
    const result = await execute(
      'SELECT * FROM recipes WHERE title LIKE ? ORDER BY title ASC;',
      [`%${query}%`]
    );
    const rows: RecipeRow[] = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      rows.push(result.rows.item(i) as RecipeRow);
    }
    return rows;
  },
};
