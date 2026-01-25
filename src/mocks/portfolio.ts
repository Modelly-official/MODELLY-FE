import { mockPortfolioImages } from '@/src/mocks/profile/designerProfile';

export type MockPortfolioItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

export const mockPortfolioItems: MockPortfolioItem[] = [
  {
    id: 1,
    title: '애쉬 레이어드컷',
    description: '레이어드 컷으로 자연스러운 볼륨을 살린 스타일입니다.',
    imageUrl: mockPortfolioImages[0],
  },
  {
    id: 2,
    title: '시스루 뱅 컷',
    description: '가벼운 시스루 뱅으로 얼굴형을 부드럽게 표현했습니다.',
    imageUrl: mockPortfolioImages[1],
  },
  {
    id: 3,
    title: '내추럴 C컬 펌',
    description: '과하지 않은 C컬로 손질이 쉬운 데일리 펌입니다.',
    imageUrl: mockPortfolioImages[2],
  },
  {
    id: 4,
    title: '볼륨 웨이브 펌',
    description: '입체적인 웨이브로 풍성한 실루엣을 완성했습니다.',
    imageUrl: mockPortfolioImages[3],
  },
  {
    id: 5,
    title: '애쉬 브라운 컬러',
    description: '부드러운 애쉬 톤으로 고급스러운 무드를 연출했습니다.',
    imageUrl: mockPortfolioImages[4],
  },
  {
    id: 6,
    title: '카키 브라운 염색',
    description: '차분한 카키 브라운으로 세련된 느낌을 강조했습니다.',
    imageUrl: mockPortfolioImages[5],
  },
  {
    id: 7,
    title: '매직 스트레이트',
    description: '깔끔한 스트레이트 라인으로 윤기 있는 모발을 완성했습니다.',
    imageUrl: mockPortfolioImages[6],
  },
  {
    id: 8,
    title: '복구 매직',
    description: '손상모를 고려한 복구 매직으로 탄력을 살렸습니다.',
    imageUrl: mockPortfolioImages[7],
  },
  {
    id: 9,
    title: '내추럴 레이어드',
    description: '일상에 자연스럽게 어울리는 레이어드 컷입니다.',
    imageUrl: mockPortfolioImages[8],
  },
];
