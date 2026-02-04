export type RecipeRow = {
  id: string;
  title: string;
  category: string | null;
  is_favorite: number;
  created_at: string;
  updated_at: string;
};

export type RecipeCardRow = {
  recipe_id: string;
  times_cooked: number;
  grade: number;
  last_cooked_at: string | null;
  updated_at: string;
};

export type DishCardRow = RecipeRow & RecipeCardRow;

export type CookLogRow = {
  id: string;
  recipe_id: string;
  cooked_at: string;
  memo: string | null;
  photo_uri: string | null;
  tags: string | null;
  created_at: string;
};

export type BookshelfEventRow = {
  id: string;
  recipe_id: string;
  event_type: string;
  occurred_at: string;
  meta: string | null;
};
