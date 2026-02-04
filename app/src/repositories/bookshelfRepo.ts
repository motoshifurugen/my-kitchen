import { execute } from '../db';
import type { BookshelfEventRow } from './types';

export type BookshelfEventType = 'added' | 'updated' | 'grade_up';

export const bookshelfRepo = {
  async insertEvent(event: BookshelfEventRow): Promise<void> {
    await execute(
      `
        INSERT INTO bookshelf_events (id, recipe_id, event_type, occurred_at, meta)
        VALUES (?, ?, ?, ?, ?);
      `,
      [event.id, event.recipe_id, event.event_type, event.occurred_at, event.meta]
    );
  },

  async listRecent(limit = 50): Promise<BookshelfEventRow[]> {
    const result = await execute(
      'SELECT * FROM bookshelf_events ORDER BY occurred_at DESC LIMIT ?;',
      [limit]
    );
    const rows: BookshelfEventRow[] = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      rows.push(result.rows.item(i) as BookshelfEventRow);
    }
    return rows;
  },

  async listRecentWithRecipe(limit = 50): Promise<(BookshelfEventRow & { title: string })[]> {
    const result = await execute(
      `
        SELECT
          bookshelf_events.id as id,
          bookshelf_events.recipe_id as recipe_id,
          bookshelf_events.event_type as event_type,
          bookshelf_events.occurred_at as occurred_at,
          bookshelf_events.meta as meta,
          recipes.title as title
        FROM bookshelf_events
        INNER JOIN recipes ON recipes.id = bookshelf_events.recipe_id
        ORDER BY bookshelf_events.occurred_at DESC
        LIMIT ?;
      `,
      [limit]
    );
    const rows: (BookshelfEventRow & { title: string })[] = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      rows.push(result.rows.item(i) as BookshelfEventRow & { title: string });
    }
    return rows;
  },
};
