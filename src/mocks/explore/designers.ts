// 디자이너 목록 Mock 데이터

import { DesignerListItem, DesignerListResponse } from '@/src/types/designer';

// Mock 디자이너 리스트 아이템들
export const mockDesignerItems: DesignerListItem[] = [
  {
    designerId: 1,
    designerName: '김수현',
    shop: '청담 헤어살롱',
    shopAddress: '서울시 강남구 청담동 123-45',
    thumbnail: '/images/mocks/profile-1.png',
    category: 'HAIR',
    reviewCount: 128,
    distance: 1.2,
    isLiked: false,
    createdAt: '2024-12-24T10:00:00Z',
  },
  {
    designerId: 2,
    designerName: '박지민',
    shop: '강남 뷰티살롱',
    shopAddress: '서울시 강남구 신사동 567-89',
    thumbnail: '/images/mocks/profile-2.png',
    category: 'HAIR',
    reviewCount: 95,
    distance: 2.5,
    isLiked: true,
    createdAt: '2024-12-23T15:30:00Z',
  },
  {
    designerId: 3,
    designerName: '이서윤',
    shop: '압구정 래쉬바',
    shopAddress: '서울시 강남구 압구정동 234-56',
    thumbnail: '/images/mocks/profile-3.png',
    category: 'EYELASH',
    reviewCount: 203,
    distance: 0.8,
    isLiked: false,
    createdAt: '2024-12-23T09:00:00Z',
  },
  {
    designerId: 4,
    designerName: '최유진',
    shop: '홍대 네일샵',
    shopAddress: '서울시 마포구 서교동 345-67',
    thumbnail: '/images/mocks/profile-1.png',
    category: 'NAIL',
    reviewCount: 76,
    distance: 3.4,
    isLiked: false,
    createdAt: '2024-12-22T14:00:00Z',
  },
  {
    designerId: 5,
    designerName: '정현우',
    shop: '이태원 타투샵',
    shopAddress: '서울시 용산구 이태원동 123-45',
    thumbnail: '/images/mocks/profile-2.png',
    category: 'TATTOO',
    reviewCount: 142,
    distance: 4.1,
    isLiked: true,
    createdAt: '2024-12-22T11:00:00Z',
  },
  {
    designerId: 6,
    designerName: '강민서',
    shop: '성수 헤어스튜디오',
    shopAddress: '서울시 성동구 성수동 456-78',
    thumbnail: '/images/mocks/profile-3.png',
    category: 'HAIR',
    reviewCount: 187,
    distance: 1.9,
    isLiked: false,
    createdAt: '2024-12-21T16:00:00Z',
  },
  {
    designerId: 7,
    designerName: '윤서아',
    shop: '역삼 아이래쉬',
    shopAddress: '서울시 강남구 역삼동 789-12',
    thumbnail: '/images/mocks/profile-1.png',
    category: 'EYELASH',
    reviewCount: 154,
    distance: 2.3,
    isLiked: false,
    createdAt: '2024-12-21T13:00:00Z',
  },
  {
    designerId: 8,
    designerName: '한지우',
    shop: '신촌 네일아트',
    shopAddress: '서울시 서대문구 신촌동 234-56',
    thumbnail: '/images/mocks/profile-2.png',
    category: 'NAIL',
    reviewCount: 89,
    distance: 3.7,
    isLiked: true,
    createdAt: '2024-12-20T10:30:00Z',
  },
];

// Mock 디자이너 리스트 응답 (첫 페이지)
export const mockDesignerListResponse: DesignerListResponse = {
  items: mockDesignerItems.slice(0, 6),
  hasNext: true,
  nextCursor: 6,
};

// Mock 디자이너 리스트 응답 (두 번째 페이지)
export const mockDesignerListResponse2: DesignerListResponse = {
  items: mockDesignerItems.slice(6, 8),
  hasNext: false,
  nextCursor: 8,
};

