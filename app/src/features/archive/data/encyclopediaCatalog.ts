/**
 * Encyclopedia Catalog
 *
 * Fixed catalog of encyclopedia entries (per issue #138).
 * Cards exist even without records.
 */

import { MENU_CATALOG, type MenuItem } from '../../../data/menuCatalog';
import type { DishCategory } from '../types';

export type EncyclopediaEntry = {
  id: MenuItem['id'];
  title: string;
  icon: MenuItem['icon'];
  category: DishCategory;
};

const CATEGORY_MAP: Partial<Record<MenuItem['id'], DishCategory>> = {
  menu_miso_soup: 'soup',
  menu_stew: 'soup',

  menu_ramen: 'noodleRice',
  menu_soba: 'noodleRice',
  menu_udon: 'noodleRice',
  menu_yakisoba: 'noodleRice',
  menu_curry_rice: 'noodleRice',
  menu_egg_rice: 'noodleRice',
  menu_fried_rice: 'noodleRice',
  menu_gyudon: 'noodleRice',
  menu_natto_rice: 'noodleRice',
  menu_omurice: 'noodleRice',
  menu_oyakodon: 'noodleRice',
  menu_onigiri: 'noodleRice',

  menu_ginger_pork: 'fry',
  menu_karaage: 'fry',
  menu_tonkatsu: 'fry',
  menu_stir_fried_pork: 'fry',
  menu_gyoza: 'fry',

  menu_grilled_salmon: 'grillBake',
  menu_hamburger: 'grillBake',
  menu_tamagoyaki: 'grillBake',

  menu_salad: 'dessertSalad',
  menu_potato_salad: 'dessertSalad',
  menu_chilled_tofu: 'dessertSalad',
};

const sortByKana = (a: EncyclopediaEntry, b: EncyclopediaEntry) =>
  a.title.localeCompare(b.title, 'ja');

export const ENCYCLOPEDIA_CATALOG: EncyclopediaEntry[] = MENU_CATALOG.map((item) => ({
  id: item.id,
  title: item.label,
  icon: item.icon,
  category: CATEGORY_MAP[item.id] ?? 'other',
})).sort(sortByKana);
