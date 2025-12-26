// 디자이너 내 공고 Mock 데이터

import type { MyRecruitmentListItem } from '@/src/types/myRecruitment';

// Mock 내 공고 리스트 아이템들
export const mockMyRecruitmentItems: MyRecruitmentListItem[] = [
  {
    recruitmentId: 1,
    title: '헤어 모델 모집합니다',
    earliestRecruitmentDate: '2025-01-15',
    thumbnail: '/images/mocks/hair-1.png',
    category: 'HAIR',
    subCategories: ['HAIR_CUT', 'HAIR_PERM'],
  },
  {
    recruitmentId: 2,
    title: '네일 아트 모델 구해요',
    earliestRecruitmentDate: '2025-01-20',
    thumbnail: '/images/mocks/nail-1.png',
    category: 'NAIL',
    subCategories: ['ART'],
  },
  {
    recruitmentId: 3,
    title: '펌 모델 급구',
    earliestRecruitmentDate: '2025-01-25',
    thumbnail: '/images/mocks/hair-2.png',
    category: 'HAIR',
    subCategories: ['HAIR_PERM'],
  },
  {
    recruitmentId: 4,
    title: '염색 모델 모집',
    earliestRecruitmentDate: '2025-01-28',
    thumbnail: '/images/mocks/hair-3.png',
    category: 'HAIR',
    subCategories: ['HAIR_COLORING'],
  },
  {
    recruitmentId: 5,
    title: '속눈썹 연장 모델',
    earliestRecruitmentDate: '2025-02-05',
    thumbnail: '/images/mocks/eyelash-1.png',
    category: 'EYELASH',
    subCategories: ['EYELASH_EXTENSION'],
  },
];

/**
 * 월별 Mock 데이터 필터링
 */
export function getMyRecruitmentsByMonth(month: string): MyRecruitmentListItem[] {
  return mockMyRecruitmentItems.filter((item) =>
    item.earliestRecruitmentDate.startsWith(month)
  );
}
