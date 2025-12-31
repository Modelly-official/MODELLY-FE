import type { Category } from '@/src/types/recruitment';

/**
 * 카테고리 한글 -> 영문 코드 매핑
 */
export const CATEGORY_KO_TO_CODE: Record<string, Category> = {
  '헤어': 'HAIR',
  '네일': 'NAIL',
  '타투': 'TATTOO',
  '속눈썹': 'EYELASH',
};

/**
 * 카테고리 영문 코드 -> 한글 매핑
 */
export const CATEGORY_CODE_TO_KO: Record<Category, string> = {
  HAIR: '헤어',
  NAIL: '네일',
  TATTOO: '타투',
  EYELASH: '속눈썹',
};

/**
 * 카테고리별 서브카테고리 한글 -> 코드 매핑
 */
export const SUBCATEGORY_KO_TO_CODE_BY_CATEGORY: Record<string, Record<string, string>> = {
  HAIR: {
    '커트': 'HAIR_CUT',
    '펌': 'HAIR_PERM',
    '염색': 'HAIR_COLORING',
    '매직': 'HAIR_MAGIC',
  },
  NAIL: {
    '원컬러': 'ONE_COLOR',
    '아트': 'ART',
    '페디큐어': 'PEDICURE',
  },
  EYELASH: {
    '펌': 'EYELASH_PERM',
    '연장': 'EYELASH_EXTENSION',
  },
  TATTOO: {
    '일반 디자인': 'NORMAL_TATTOO',
    '입술 문신': 'LIP_TATTOO',
    '눈썹 문신': 'EYEBROW_TATTOO',
  },
};

/**
 * 카테고리별 서브카테고리 코드 -> 한글 매핑
 */
export const SUBCATEGORY_CODE_TO_KO_BY_CATEGORY: Record<string, Record<string, string>> = {
  HAIR: {
    HAIR_CUT: '커트',
    HAIR_PERM: '펌',
    HAIR_COLORING: '염색',
    HAIR_MAGIC: '매직',
  },
  NAIL: {
    ONE_COLOR: '원컬러',
    ART: '아트',
    PEDICURE: '페디큐어',
  },
  EYELASH: {
    EYELASH_PERM: '펌',
    EYELASH_EXTENSION: '연장',
  },
  TATTOO: {
    NORMAL_TATTOO: '일반 디자인',
    LIP_TATTOO: '입술 문신',
    EYEBROW_TATTOO: '눈썹 문신',
  },
};

/**
 * 한글 카테고리명을 영문 코드로 변환
 * @param categoryName 한글 또는 영문 카테고리명
 * @returns 영문 카테고리 코드 또는 null
 */
export function categoryNameToCode(categoryName: string): Category | null {
  // 이미 영문 코드인 경우
  if (['HAIR', 'NAIL', 'TATTOO', 'EYELASH'].includes(categoryName.toUpperCase())) {
    return categoryName.toUpperCase() as Category;
  }
  // 한글인 경우
  return CATEGORY_KO_TO_CODE[categoryName] || null;
}

/**
 * 영문 카테고리 코드를 한글로 변환
 * @param categoryCode 영문 카테고리 코드
 * @returns 한글 카테고리명 또는 null
 */
export function categoryCodeToName(categoryCode: Category): string | null {
  return CATEGORY_CODE_TO_KO[categoryCode] || null;
}

/**
 * 한글 서브카테고리명을 영문 코드로 변환
 * @param categoryCode 부모 카테고리 코드 (HAIR, NAIL 등)
 * @param subCategoryName 한글 서브카테고리명
 * @returns 영문 서브카테고리 코드 또는 원본 값
 */
export function subCategoryNameToCode(categoryCode: string, subCategoryName: string): string {
  const categoryMapping = SUBCATEGORY_KO_TO_CODE_BY_CATEGORY[categoryCode];
  return categoryMapping?.[subCategoryName] || subCategoryName;
}

/**
 * 영문 서브카테고리 코드를 한글로 변환
 * @param categoryCode 부모 카테고리 코드 (HAIR, NAIL 등)
 * @param subCategoryCode 영문 서브카테고리 코드
 * @returns 한글 서브카테고리명 또는 원본 값
 */
export function subCategoryCodeToName(categoryCode: string, subCategoryCode: string): string {
  const categoryMapping = SUBCATEGORY_CODE_TO_KO_BY_CATEGORY[categoryCode];
  return categoryMapping?.[subCategoryCode] || subCategoryCode;
}
