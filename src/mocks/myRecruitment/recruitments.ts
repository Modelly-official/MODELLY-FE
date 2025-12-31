// 디자이너 내 공고 Mock 데이터

import type { MyRecruitmentListItem } from '@/src/types/myRecruitment';

// Mock 데이터 (필터링용 _month 필드 포함)
interface MockRecruitmentItem extends MyRecruitmentListItem {
  _month: string; // 필터링용 (YYYY-MM)
}

// Mock 내 공고 리스트 아이템들
export const mockMyRecruitmentItems: MockRecruitmentItem[] = [
  {
    recruitmentId: 1,
    title: '애쉬브라운 헤어모델 구합니다',
    period: '12.28 ~ 12.30',
    reviewCount: 12,
    averageRating: 4.8,
    thumbnail: '/images/mocks/hair-1.png',
    subCategory: ['커트', '염색'],
    _month: '2025-12',
  },
  {
    recruitmentId: 2,
    title: '네일 아트 모델 구해요',
    period: '12.30 ~ 1.2',
    reviewCount: 8,
    averageRating: 4.5,
    thumbnail: '/images/mocks/hair-2.png',
    subCategory: ['아트'],
    _month: '2025-12',
  },
  {
    recruitmentId: 3,
    title: '펌 모델 급구',
    period: '1.5 ~ 1.7',
    reviewCount: 5,
    averageRating: 4.9,
    thumbnail: '/images/mocks/hair-3.png',
    subCategory: ['펌'],
    _month: '2026-01',
  },
  {
    recruitmentId: 4,
    title: '염색 모델 모집',
    period: '1.10 ~ 1.12',
    reviewCount: 3,
    averageRating: 5.0,
    thumbnail: '/images/mocks/hair-4.png',
    subCategory: ['염색'],
    _month: '2026-01',
  },
  {
    recruitmentId: 5,
    title: '속눈썹 연장 모델',
    period: '1.15 ~ 1.17',
    reviewCount: 0,
    averageRating: 0,
    thumbnail: '/images/mocks/hair-5.png',
    subCategory: ['속눈썹 연장'],
    _month: '2026-01',
  },
];

/**
 * 월별 Mock 데이터 필터링
 */
export function getMyRecruitmentsByMonth(month: string): MyRecruitmentListItem[] {
  return mockMyRecruitmentItems
    .filter((item) => item._month === month)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ _month, ...rest }) => rest); // _month 필드 제거하여 반환
}
