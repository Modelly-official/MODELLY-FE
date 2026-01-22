import type { DesignerProfileResponse } from '@/src/types/profile';

export const mockPortfolioImages = [
  '/images/mocks/portfolio-1.png',
  '/images/mocks/portfolio-2.png',
  '/images/mocks/portfolio-3.png',
  '/images/mocks/portfolio-4.png',
  '/images/mocks/portfolio-5.png',
  '/images/mocks/portfolio-6.png',
  '/images/mocks/hair-1.png',
  '/images/mocks/hair-2.png',
  '/images/mocks/hair-3.png',
];

export const getMockDesignerProfile = (designerId: number): DesignerProfileResponse => ({
  profile: {
    designerUserId: 101,
    designerId,
    nickname: '서아',
    profileImageUrl: '/images/mocks/profile-1.png',
    shop: '무드컷 헤어',
    address: {
      line1: '서울특별시 중구 남대문로45길 3-8',
      line2: '(무드컷헤어) 무드컷헤어 2층',
    },
    intro:
      '자연스러운 스타일을 추구하는 헤어 디자이너입니다.\n커트와 레이어드에 강점이 있으며, 손질이 쉬운 데일리 헤어를 제안합니다.',
    isLiked: false,
  },
  openRecruitments: [
    {
      recruitmentId: 5,
      title: '애쉬브라운 헤어모델 구합니다',
      thumbnailUrl: '/images/mocks/hair-1.png',
      startDate: '2024-12-30',
      deadline: '2025-01-01',
      subCategories: ['HAIR_CUT', 'HAIR_PERM'],
    },
    {
      recruitmentId: 6,
      title: '레이어드 컷 + 볼륨펌 모델 구합니다',
      thumbnailUrl: '/images/mocks/hair-2.png',
      startDate: '2024-12-30',
      deadline: '2025-01-01',
      subCategories: ['HAIR_CUT', 'HAIR_PERM'],
    },
  ],
});
