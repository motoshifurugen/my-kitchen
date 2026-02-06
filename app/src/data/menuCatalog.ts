/**
 * Menu Catalog
 *
 * Canonical list of menu items backed by menu icon assets.
 * Used for search/selection in record flow and future catalog features.
 */

import { MENU_ICONS } from '../assets/manifest';

export type MenuItem = {
  id: keyof typeof MENU_ICONS;
  label: string;
  icon: (typeof MENU_ICONS)[keyof typeof MENU_ICONS];
};

const LABELS: Record<keyof typeof MENU_ICONS, string> = {
  menu_chilled_tofu: '冷奴',
  menu_curry_rice: 'カレーライス',
  menu_egg_rice: '卵かけご飯',
  menu_fried_rice: 'チャーハン',
  menu_ginger_pork: 'しょうが焼き',
  menu_grilled_salmon: '焼き鮭',
  menu_gyoza: '餃子',
  menu_gyudon: '牛丼',
  menu_hamburger: 'ハンバーグ',
  menu_karaage: '唐揚げ',
  menu_miso_soup: '味噌汁',
  menu_natto_rice: '納豆ご飯',
  menu_nikujaga: '肉じゃが',
  menu_omurice: 'オムライス',
  menu_onigiri: 'おにぎり',
  menu_oyakodon: '親子丼',
  menu_potato_salad: 'ポテトサラダ',
  menu_ramen: 'ラーメン',
  menu_salad: 'サラダ',
  menu_sashimi: '刺身',
  menu_soba: 'そば',
  menu_stew: 'シチュー',
  menu_stir_fried_pork: '豚肉炒め',
  menu_tamagoyaki: '卵焼き',
  menu_tonkatsu: 'とんかつ',
  menu_udon: 'うどん',
  menu_yakisoba: '焼きそば',
};

export const MENU_CATALOG: MenuItem[] = Object.entries(MENU_ICONS).map(
  ([id, icon]) => ({
    id: id as keyof typeof MENU_ICONS,
    label: LABELS[id as keyof typeof MENU_ICONS],
    icon,
  })
);

// Pre-built lookup by label for O(1) access
const iconByLabel = new Map<string, MenuItem['icon']>(
  MENU_CATALOG.map((item) => [item.label, item.icon])
);

/**
 * Look up menu icon source by dish title (Japanese label).
 * Returns null if no matching menu item found.
 */
export function getMenuIconSource(title: string): MenuItem['icon'] | null {
  return iconByLabel.get(title) ?? null;
}
