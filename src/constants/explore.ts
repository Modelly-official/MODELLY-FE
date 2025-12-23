import type { Category, SubCategory, SortOption } from '@/src/types';

// 카테고리
export const CATEGORIES: Category[] = [
  { code: 'HAIR', name: '헤어' },
  { code: 'NAIL', name: '네일' },
  { code: 'TATTOO', name: '타투' },
  { code: 'EYELASH', name: '속눈썹' },
];

// 서브 카테고리 (헤어)
export const HAIR_SUB_CATEGORIES: SubCategory[] = [
  { code: 'ALL', name: '전체' },
  { code: 'CUT', name: '커트' },
  { code: 'PERM', name: '펌' },
  { code: 'COLOR', name: '염색' },
  { code: 'MAGIC', name: '매직' },
];

// 정렬 옵션
export const SORT_OPTIONS: SortOption[] = [
  { code: 'LATEST', name: '최신순' },
  { code: 'DISTANCE', name: '거리순' },
  { code: 'REVIEW', name: '후기 많은 순' },
];

