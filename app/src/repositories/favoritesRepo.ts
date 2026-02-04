import { execute } from '../db';

export const favoritesRepo = {
  async setFavorite(recipeId: string, isFavorite: boolean): Promise<void> {
    await execute(
      'UPDATE recipes SET is_favorite = ?, updated_at = ? WHERE id = ?;',
      [isFavorite ? 1 : 0, new Date().toISOString(), recipeId]
    );
  },
};
