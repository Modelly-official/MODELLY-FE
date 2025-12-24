// 공고 상세 Mock 데이터

import { RecruitmentDetail } from '@/src/types/recruitment/recruitment';

// Figma 기준 공고 상세 데이터
export const mockRecruitmentDetail: RecruitmentDetail = {
  designerProfile: {
    userId: 101,
    designerId: 1,
    shop: '무드컷 헤어',
    shopAddress: '서울시 마포구 연남동 123-45',
  },
  recruitmentId: 1,
  title: '헤어 컨설팅 모델 모집합니다',
  recruitmentSchedule: [
    {
      recruitmentDate: '2025-12-28',
      recruitmentTimes: ['10:00', '14:00', '16:00'],
    },
    {
      recruitmentDate: '2025-12-29',
      recruitmentTimes: ['11:00', '15:00'],
    },
    {
      recruitmentDate: '2025-12-30',
      recruitmentTimes: ['10:00', '13:00', '17:00'],
    },
  ],
  category: 'HAIR',
  subCategories: ['HAIR_PERM', 'HAIR_CUT'],
  content:
    '레이어드 컷과 웨이브 펌을 함께 진행하실 모델분을 모집합니다.\n\n자연스러운 레이어드 컷으로 볼륨감을 살리고, 부드러운 웨이브 펌으로 여성스러운 스타일을 연출해드립니다.\n\n시술 시간은 약 3-4시간 소요 예정이며, 전 과정을 사진과 영상으로 촬영하여 포트폴리오로 활용할 예정입니다.',
  notice: '탈색 2회 이상 불가능',
  goal1: '포트폴리오',
  goal2: '포트폴리오',
  goal3: '포트폴리오',
  imageUrls: [
    '/images/mocks/hair-1.png',
    '/images/mocks/hair-2.png',
    '/images/mocks/hair-3.png',
    '/images/mocks/hair-4.png',
    '/images/mocks/hair-5.png',
  ],
  agreeVideo: true,
  agreeInsta: true,
  agreeMosaic: false,
  etc: '시술 후 홈케어 방법과 스타일링 팁도 자세히 알려드립니다. 궁금한 점이 있으시면 언제든 문의해주세요!',
};

// 두 번째 공고 상세 Mock 데이터
export const mockRecruitmentDetail2: RecruitmentDetail = {
  designerProfile: {
    userId: 102,
    designerId: 2,
    shop: '무드컷 스튜디오',
    shopAddress: '서울시 마포구 상수동 234-56',
  },
  recruitmentId: 2,
  title: '포트폴리오 촬영용 헤어 모델',
  recruitmentSchedule: [
    {
      recruitmentDate: '2025-12-27',
      recruitmentTimes: ['13:00', '15:00'],
    },
    {
      recruitmentDate: '2025-12-28',
      recruitmentTimes: ['10:00', '14:00'],
    },
  ],
  category: 'HAIR',
  subCategories: ['HAIR_COLORING'],
  content:
    '트렌디한 애쉬 브라운 컬러로 염색하실 모델분을 모집합니다.\n\n프리미엄 염색약을 사용하여 모발 손상을 최소화하면서 선명하고 지속력 있는 컬러를 표현합니다.\n\n시술 시간은 약 2-3시간 소요됩니다.',
  notice: '• 최근 3개월 이내 염색 이력이 없으신 분\n• 탈색이 필요할 수 있습니다\n• 두피 민감도 테스트 필수',
  goal1: '트렌디한 애쉬 브라운 컬러 표현',
  goal2: '모발 손상 최소화',
  goal3: '색상 지속력 극대화',
  imageUrls: ['/images/mocks/hair-2.png', '/images/mocks/hair-3.png'],
  agreeVideo: true,
  agreeInsta: true,
  agreeMosaic: true,
  etc: '염색 후 컬러 유지를 위한 홈케어 제품도 추천해드립니다.',
};
