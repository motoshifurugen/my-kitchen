PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL UNIQUE,
  category TEXT,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS records (
  id TEXT PRIMARY KEY NOT NULL,
  recipe_id TEXT NOT NULL,
  cooked_at TEXT NOT NULL,
  memo TEXT,
  photo_uri TEXT,
  tags TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_records_recipe_id ON records(recipe_id);
CREATE INDEX IF NOT EXISTS idx_records_cooked_at ON records(cooked_at);
