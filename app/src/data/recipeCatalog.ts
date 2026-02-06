/**
 * Recipe Catalog
 *
 * Static 3-step recipes keyed by menu icon key.
 * Fallback template is provided for undefined recipes.
 */

import type { MenuItem } from './menuCatalog';

export type RecipeStepGenre = 'prep' | 'heat' | 'finish';

export type RecipeStep = {
  genre: RecipeStepGenre;
  title: string;
  body: string;
};

export type RecipeStepsByMenu = Partial<Record<MenuItem['id'], RecipeStep[]>>;

export const RECIPE_STEPS_BY_MENU: RecipeStepsByMenu = {
  menu_miso_soup: [
    {
      genre: 'prep',
      title: 'だしと具材を整える',
      body: 'だしを取り、具材を食べやすい大きさにしておきます。',
    },
    {
      genre: 'heat',
      title: '具材を温める',
      body: 'だしに具材を入れて、やわらかくなるまで温めます。',
    },
    {
      genre: 'finish',
      title: '味噌を溶く',
      body: '火を弱めて味噌を溶き、香りが立ったら完成です。',
    },
  ],
  menu_curry_rice: [
    {
      genre: 'prep',
      title: '具材を切る',
      body: '玉ねぎやにんじんを、ほどよい大きさにそろえます。',
    },
    {
      genre: 'heat',
      title: '煮込む',
      body: '具材を炒めてから水を加え、やわらかくなるまで煮ます。',
    },
    {
      genre: 'finish',
      title: 'ルウを溶く',
      body: '火を弱めてルウを溶き、少しだけとろみを整えます。',
    },
  ],
  menu_onigiri: [
    {
      genre: 'prep',
      title: '具を用意する',
      body: '具材をほぐして、味を整えておきます。',
    },
    {
      genre: 'heat',
      title: 'ご飯を温める',
      body: 'ご飯をほんのり温めて、握りやすくします。',
    },
    {
      genre: 'finish',
      title: '形を整える',
      body: '塩をつけて、やさしく形を整えます。',
    },
  ],
};

export const FALLBACK_RECIPE_STEPS: RecipeStep[] = [
  {
    genre: 'prep',
    title: '材料を整える',
    body: 'いつもの手順で、必要なものをそろえておきます。',
  },
  {
    genre: 'heat',
    title: '火を入れる',
    body: 'ほどよい温度で、ゆっくり仕上げていきます。',
  },
  {
    genre: 'finish',
    title: '形を整える',
    body: '最後に味を整えて、ひと皿にまとめます。',
  },
];

export const getRecipeSteps = (
  menuId?: MenuItem['id'] | null
): { steps: RecipeStep[]; isFallback: boolean } => {
  if (!menuId) {
    return { steps: FALLBACK_RECIPE_STEPS, isFallback: true };
  }
  const steps = RECIPE_STEPS_BY_MENU[menuId];
  if (!steps || steps.length === 0) {
    return { steps: FALLBACK_RECIPE_STEPS, isFallback: true };
  }
  return { steps, isFallback: false };
};
