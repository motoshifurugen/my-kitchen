import { cardsRepo } from './cardsRepo';
import { logsRepo } from './logsRepo';
import { bookshelfRepo } from './bookshelfRepo';
import { recipesRepo } from './recipesRepo';
import type { RecipeRow, RecipeCardRow, CookLogRow } from './types';
import { execute } from '../db';
import { ENCYCLOPEDIA_CATALOG } from '../features/archive/data/encyclopediaCatalog';

const nowIso = () => new Date().toISOString();

const generateId = () =>
  `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const gradeFromTimes = (times: number) => {
  if (times <= 0) return 0;
  if (times <= 2) return 1;
  if (times <= 5) return 2;
  if (times <= 9) return 3;
  return 4;
};

const resolveRecipeId = async (title: string): Promise<RecipeRow> => {
  const existing = await recipesRepo.getByTitle(title);
  if (existing) return existing;

  const catalog = ENCYCLOPEDIA_CATALOG.find((entry) => entry.title === title);
  const id = catalog?.id ?? `custom_${generateId()}`;
  const category = catalog?.category ?? null;
  const timestamp = nowIso();

  await execute(
    `
      INSERT OR IGNORE INTO recipes (id, title, category, is_favorite, created_at, updated_at)
      VALUES (?, ?, ?, 0, ?, ?);
    `,
    [id, title, category, timestamp, timestamp]
  );

  const inserted = await recipesRepo.getById(id);
  if (!inserted) {
    throw new Error('recipe insert failed');
  }
  return inserted;
};

export type RecordInput = {
  title: string;
  memo?: string;
  photoUri?: string | null;
};

export const recordCooking = async (input: RecordInput): Promise<{ recipeId: string }> => {
  const cookedAt = nowIso();
  const recipe = await resolveRecipeId(input.title);

  const currentCard = await cardsRepo.getCardByRecipeId(recipe.id);
  const previousTimes = currentCard?.times_cooked ?? 0;
  const previousGrade = currentCard?.grade ?? 0;

  const nextTimes = previousTimes + 1;
  const nextGrade = gradeFromTimes(nextTimes);

  const nextCard: RecipeCardRow = {
    recipe_id: recipe.id,
    times_cooked: nextTimes,
    grade: nextGrade,
    last_cooked_at: cookedAt,
    updated_at: cookedAt,
  };

  await cardsRepo.upsertCard(nextCard);

  const log: CookLogRow = {
    id: generateId(),
    recipe_id: recipe.id,
    cooked_at: cookedAt,
    memo: input.memo ?? null,
    photo_uri: input.photoUri ?? null,
    tags: null,
    created_at: cookedAt,
  };
  await logsRepo.insert(log);

  const baseEventType = previousTimes === 0 ? 'added' : 'updated';
  await bookshelfRepo.insertEvent({
    id: generateId(),
    recipe_id: recipe.id,
    event_type: baseEventType,
    occurred_at: cookedAt,
    meta: null,
  });

  if (nextGrade > previousGrade) {
    await bookshelfRepo.insertEvent({
      id: generateId(),
      recipe_id: recipe.id,
      event_type: 'grade_up',
      occurred_at: cookedAt,
      meta: JSON.stringify({ from: previousGrade, to: nextGrade }),
    });
  }

  return { recipeId: recipe.id };
};
