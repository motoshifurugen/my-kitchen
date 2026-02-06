/**
 * menuCatalog tests
 *
 * Tests for getMenuIconSource helper.
 */

import { getMenuIconSource, MENU_CATALOG } from '../menuCatalog';

describe('getMenuIconSource', () => {
  it('returns icon source for a known menu title', () => {
    // '肉じゃが' is in the catalog
    const result = getMenuIconSource('肉じゃが');
    expect(result).not.toBeNull();
    expect(result).toBeDefined();
  });

  it('returns icon source for another known menu title', () => {
    const result = getMenuIconSource('カレーライス');
    expect(result).not.toBeNull();
  });

  it('returns null for an unknown title', () => {
    const result = getMenuIconSource('存在しない料理');
    expect(result).toBeNull();
  });

  it('returns null for empty string', () => {
    const result = getMenuIconSource('');
    expect(result).toBeNull();
  });

  it('returns the same icon as the catalog entry for a matching title', () => {
    const catalogEntry = MENU_CATALOG.find((item) => item.label === '味噌汁');
    const result = getMenuIconSource('味噌汁');
    expect(result).toBe(catalogEntry?.icon);
  });
});
