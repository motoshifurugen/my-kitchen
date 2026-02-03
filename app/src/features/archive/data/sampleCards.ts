/**
 * Sample Cards Data
 *
 * Mock data for development and testing.
 * Will be replaced with actual data source in production.
 */

import { DishCard } from '../types';

export const SAMPLE_CARDS: DishCard[] = [
  {
    id: '1',
    title: '肉じゃが',
    memo: '今日は少し甘めに仕上げた。母の味を思い出す。',
    tags: ['夜ごはん', '作り置き'],
    cookedAt: '2024-03-15T18:30:00.000Z',
    cookCount: 5,
    category: 'other',
    isFavorite: true,
  },
  {
    id: '2',
    title: 'カレーライス',
    memo: 'りんごを入れてまろやかに',
    tags: ['夜ごはん'],
    cookedAt: '2024-03-10T12:00:00.000Z',
    cookCount: 3,
    category: 'noodleRice',
  },
  {
    id: '3',
    title: '味噌汁',
    memo: 'わかめと豆腐',
    tags: ['朝ごはん'],
    cookedAt: '2024-03-20T08:00:00.000Z',
    cookCount: 15,
    category: 'soup',
  },
  {
    id: '4',
    title: '野菜炒め',
    tags: ['夜ごはん', '野菜'],
    cookedAt: '2024-03-18T19:00:00.000Z',
    cookCount: 8,
    category: 'fry',
  },
  {
    id: '5',
    title: '焼き魚（鮭）',
    memo: '塩加減がちょうどよかった',
    tags: ['朝ごはん'],
    cookedAt: '2024-03-12T07:30:00.000Z',
    cookCount: 6,
    category: 'grillBake',
    isFavorite: true,
  },
  {
    id: '6',
    title: 'パスタ（ペペロンチーノ）',
    memo: 'にんにく多め',
    tags: ['昼ごはん'],
    cookedAt: '2024-03-08T12:30:00.000Z',
    cookCount: 2,
    category: 'noodleRice',
  },
  {
    id: '7',
    title: 'サラダ',
    tags: ['夜ごはん', '野菜'],
    cookedAt: '2024-03-19T18:00:00.000Z',
    cookCount: 4,
    category: 'dessertSalad',
  },
  {
    id: '8',
    title: 'オムライス',
    memo: 'ケチャップで絵を描いた',
    tags: ['昼ごはん'],
    cookedAt: '2024-03-05T12:00:00.000Z',
    cookCount: 1,
    category: 'noodleRice',
  },
];
