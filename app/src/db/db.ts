/**
 * Database Helpers
 *
 * Thin wrapper around expo-sqlite with Promise helpers.
 */

import * as SQLite from 'expo-sqlite';

export type SqlArgs = Array<string | number | null>;

type RowsResult<T = any> = {
  length: number;
  item: (index: number) => T;
};

export type QueryResult<T = any> = {
  rows: RowsResult<T>;
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbPromise) {
    if (typeof (SQLite as any).openDatabaseAsync === 'function') {
      dbPromise = (SQLite as any).openDatabaseAsync('my-kitchen.db');
    } else if (typeof (SQLite as any).openDatabaseSync === 'function') {
      const db = (SQLite as any).openDatabaseSync('my-kitchen.db');
      dbPromise = Promise.resolve(db);
    } else if (typeof (SQLite as any).openDatabase === 'function') {
      dbPromise = Promise.resolve((SQLite as any).openDatabase('my-kitchen.db'));
    } else {
      throw new Error('SQLite.openDatabase is not available');
    }
  }
  return dbPromise;
};

const isSelectLike = (sql: string) => /^\s*(select|pragma|with)\b/i.test(sql);

const createRowsResult = <T>(rows: T[]): RowsResult<T> => ({
  length: rows.length,
  item: (index: number) => rows[index],
});

export const execute = async <T = any>(
  sql: string,
  args: SqlArgs = []
): Promise<QueryResult<T>> => {
  const db = await openDatabase();
  if (isSelectLike(sql) && typeof (db as any).getAllAsync === 'function') {
    const rows = await (db as any).getAllAsync<T>(sql, args);
    return { rows: createRowsResult(rows) };
  }

  if (typeof (db as any).runAsync === 'function') {
    await (db as any).runAsync(sql, args);
    return { rows: createRowsResult<T>([]) };
  }

  // Fallback to legacy transaction API if available
  return new Promise((resolve, reject) => {
    (db as any).transaction(
      (tx: any) => {
        tx.executeSql(
          sql,
          args,
          (_: any, result: any) => resolve(result),
          (_: any, error: any) => {
            reject(error);
            return false;
          }
        );
      },
      (error: any) => reject(error)
    );
  });
};

export const executeBatch = async (statements: string[]): Promise<void> => {
  if (statements.length === 0) return;
  const db = await openDatabase();

  if (typeof (db as any).execAsync === 'function') {
    await (db as any).execAsync('BEGIN;');
    try {
      for (const statement of statements) {
        if (!statement.trim()) continue;
        await (db as any).execAsync(statement);
      }
      await (db as any).execAsync('COMMIT;');
      return;
    } catch (error) {
      await (db as any).execAsync('ROLLBACK;');
      throw error;
    }
  }

  // Fallback to legacy transaction API
  return new Promise((resolve, reject) => {
    (db as any).transaction(
      (tx: any) => {
        statements.forEach((statement) => {
          if (!statement.trim()) return;
          tx.executeSql(statement);
        });
      },
      (error: any) => reject(error),
      () => resolve()
    );
  });
};
