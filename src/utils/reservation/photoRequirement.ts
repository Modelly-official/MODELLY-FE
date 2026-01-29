import type { Category } from '@/src/types/recruitment';
import { categoryNameToCode } from '@/src/utils/myRecruitment/category/categoryMapping';

// 사진 선택(옵션) 카테고리
const OPTIONAL_PHOTO_CATEGORIES: Category[] = ['TATTOO', 'EYELASH'];

/**
 * 해당 카테고리에서 사진이 필수인지 확인
 * @param category 카테고리 코드 또는 한글명 (예: 'HAIR', '헤어')
 */
export function isPhotoRequired(category: string): boolean {
  const categoryCode = categoryNameToCode(category);
  if (!categoryCode) return true; // 인식 불가 시 필수로 처리
  return !OPTIONAL_PHOTO_CATEGORIES.includes(categoryCode);
}
