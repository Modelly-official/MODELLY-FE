import type {
  Category as CategoryType,
  SubCategory as SubCategoryType,
  SortOption as SortOptionType,
} from '@/src/types';

// UI에서 사용할 카테고리 인터페이스
export interface Category {
  code: CategoryType;
  name: string;
}

export interface SubCategory {
  code: SubCategoryType | 'ALL';
  name: string;
}

export interface SortOption {
  code: SortOptionType;
  name: string;
}

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
  { code: 'HAIR_CUT', name: '커트' },
  { code: 'HAIR_PERM', name: '펌' },
  { code: 'HAIR_COLORING', name: '염색' },
  { code: 'HAIR_MAGIC', name: '매직' },
];

// 정렬 옵션
export const SORT_OPTIONS: SortOption[] = [
  { code: 'NEWEST', name: '최신순' },
  { code: 'DISTANCE', name: '거리순' },
  { code: 'MOST_REVIEWS', name: '후기 많은 순' },
];
