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

// 서브 카테고리 (네일)
export const NAIL_SUB_CATEGORIES: SubCategory[] = [
  { code: 'ALL', name: '전체' },
  { code: 'ONE_COLOR', name: '원컬러' },
  { code: 'ART', name: '아트' },
  { code: 'PEDICURE', name: '페디큐어' },
];

// 서브 카테고리 (속눈썹)
export const EYELASH_SUB_CATEGORIES: SubCategory[] = [
  { code: 'ALL', name: '전체' },
  { code: 'EYELASH_PERM', name: '펌' },
  { code: 'EYELASH_EXTENSION', name: '연장' },
];

// 서브 카테고리 (타투)
export const TATTOO_SUB_CATEGORIES: SubCategory[] = [
  { code: 'ALL', name: '전체' },
  { code: 'NORMAL_TATTOO', name: '일반 디자인' },
  { code: 'LIP_TATTOO', name: '입술 문신' },
  { code: 'EYEBROW_TATTOO', name: '눈썹 문신' },
];

// 카테고리별 서브카테고리 매핑
export const SUB_CATEGORIES_BY_CATEGORY: Record<CategoryType, SubCategory[]> = {
  HAIR: HAIR_SUB_CATEGORIES,
  NAIL: NAIL_SUB_CATEGORIES,
  EYELASH: EYELASH_SUB_CATEGORIES,
  TATTOO: TATTOO_SUB_CATEGORIES,
};

// 정렬 옵션
export const SORT_OPTIONS: SortOption[] = [
  { code: 'NEWEST', name: '최신순' },
  { code: 'DISTANCE', name: '거리순' },
  { code: 'MOST_REVIEWS', name: '후기 많은 순' },
];

// ===== 카테고리 라벨 (단일 소스) =====
// 카테고리/서브카테고리 코드를 한글로 변환하는 매핑
export const CATEGORY_LABELS: Record<string, string> = {
  // 메인 카테고리
  HAIR: '헤어',
  NAIL: '네일',
  TATTOO: '타투',
  EYELASH: '속눈썹',
  // 헤어 서브카테고리
  HAIR_CUT: '커트',
  HAIR_PERM: '펌',
  HAIR_COLORING: '염색',
  HAIR_MAGIC: '매직',
  // 네일 서브카테고리
  ONE_COLOR: '원컬러',
  ART: '아트',
  PEDICURE: '페디큐어',
  // 속눈썹 서브카테고리
  EYELASH_PERM: '펌',
  EYELASH_EXTENSION: '연장',
  // 타투 서브카테고리
  NORMAL_TATTOO: '일반 디자인',
  LIP_TATTOO: '입술 문신',
  EYEBROW_TATTOO: '눈썹 문신',
};

/**
 * 카테고리 코드를 한글 라벨로 변환
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}
