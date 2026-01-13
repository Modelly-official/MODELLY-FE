// 리뷰 관련 상수

import type { ReviewTabType, ReviewCategoryFilter } from '@/src/types';

/** 리뷰 탭 옵션 */
export const REVIEW_TABS: { value: ReviewTabType; label: string }[] = [
  { value: 'unreviewed', label: '리뷰 미작성 일정' },
  { value: 'written', label: '작성한 리뷰' },
];

/** 리뷰 카테고리 필터 옵션 */
export const REVIEW_CATEGORY_FILTERS: { code: ReviewCategoryFilter; name: string }[] = [
  { code: 'ALL', name: '전체' },
  { code: 'HAIR', name: '헤어' },
  { code: 'NAIL', name: '네일' },
  { code: 'TATTOO', name: '타투' },
  { code: 'EYELASH', name: '속눈썹' },
];
