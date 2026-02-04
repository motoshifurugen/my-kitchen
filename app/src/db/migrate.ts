/**
 * Migrations Runner
 *
 * Creates schema_migrations and applies pending migrations in order.
 */

import { execute, executeBatch } from './db';

type Migration = {
  id: string;
  sql: string;
};

const MIGRATION_001_SQL = `
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
`;

const MIGRATION_002_SQL = `
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
`;

const MIGRATIONS: Migration[] = [
  {
    id: '001_init',
    sql: MIGRATION_001_SQL,
  },
  {
    id: '002_add_cards_logs_events',
    sql: MIGRATION_002_SQL,
  },
];

const splitStatements = (sql: string): string[] => {
  const withoutComments = sql.replace(/--.*$/gm, '');
  return withoutComments
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);
};

const ensureSchemaMigrations = async () => {
  await execute(
    `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY NOT NULL,
        applied_at TEXT NOT NULL
      );
    `
  );
};

const getAppliedVersions = async (): Promise<Set<string>> => {
  const result = await execute('SELECT version FROM schema_migrations;');
  const versions = new Set<string>();
  for (let i = 0; i < result.rows.length; i += 1) {
    versions.add(result.rows.item(i).version);
  }
  return versions;
};

const applyMigration = async (migration: Migration) => {
  const statements = splitStatements(migration.sql);
  await executeBatch(statements);
  await execute(
    'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?);',
    [migration.id, new Date().toISOString()]
  );
};

export const runMigrations = async () => {
  await ensureSchemaMigrations();

  const applied = await getAppliedVersions();
  for (const migration of MIGRATIONS) {
    if (applied.has(migration.id)) continue;
    try {
      await applyMigration(migration);
      console.info(`[db] Migration applied: ${migration.id}`);
    } catch (error) {
      console.error(`[db] Migration failed: ${migration.id}`, error);
      throw error;
    }
  }
};
