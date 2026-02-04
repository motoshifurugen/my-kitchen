PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS recipe_cards (
  recipe_id TEXT PRIMARY KEY NOT NULL,
  times_cooked INTEGER NOT NULL DEFAULT 0,
  grade INTEGER NOT NULL DEFAULT 0,
  last_cooked_at TEXT,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cook_logs (
  id TEXT PRIMARY KEY NOT NULL,
  recipe_id TEXT NOT NULL,
  cooked_at TEXT NOT NULL,
  memo TEXT,
  photo_uri TEXT,
  tags TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookshelf_events (
  id TEXT PRIMARY KEY NOT NULL,
  recipe_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  meta TEXT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_recipe_cards_updated_at ON recipe_cards(updated_at);
CREATE INDEX IF NOT EXISTS idx_cook_logs_recipe_id ON cook_logs(recipe_id);
CREATE INDEX IF NOT EXISTS idx_cook_logs_cooked_at ON cook_logs(cooked_at);
CREATE INDEX IF NOT EXISTS idx_bookshelf_events_occurred_at ON bookshelf_events(occurred_at);
