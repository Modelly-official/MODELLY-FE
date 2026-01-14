import type { MapShopApiItem, MapShopItem } from '@/src/types/map';
import { categoryNameToCode } from '@/src/utils/myRecruitment/category/categoryMapping';

// 홍대입구역 기준 Mock 데이터 (API 응답 구조와 동일)
// 기본 좌표: 홍대입구역 (37.5571, 126.9236)

export const mockMapShopsRaw: MapShopApiItem[] = [
  // HAIR 샵
  {
    designerId: 1,
    shopName: '헤어살롱 A',
    category: '헤어',
    shopLatitude: 37.5571,
    shopLongitude: 126.9236,
  },
  {
    designerId: 2,
    shopName: '스타일리시 헤어',
    category: '헤어',
    shopLatitude: 37.558,
    shopLongitude: 126.925,
  },
  {
    designerId: 3,
    shopName: '프리미엄 헤어샵',
    category: '헤어',
    shopLatitude: 37.556,
    shopLongitude: 126.922,
  },
  {
    designerId: 4,
    shopName: '트렌디 헤어',
    category: '헤어',
    shopLatitude: 37.559,
    shopLongitude: 126.926,
  },

  // NAIL 샵
  {
    designerId: 5,
    shopName: '네일아트 스튜디오',
    category: '네일',
    shopLatitude: 37.5575,
    shopLongitude: 126.923,
  },
  {
    designerId: 6,
    shopName: '프렌치 네일',
    category: '네일',
    shopLatitude: 37.5565,
    shopLongitude: 126.9245,
  },
  {
    designerId: 7,
    shopName: '네일팩토리',
    category: '네일',
    shopLatitude: 37.5585,
    shopLongitude: 126.9215,
  },

  // TATTOO 샵
  {
    designerId: 8,
    shopName: '잉크 스튜디오',
    category: '타투',
    shopLatitude: 37.5555,
    shopLongitude: 126.924,
  },
  {
    designerId: 9,
    shopName: '아트 타투',
    category: '타투',
    shopLatitude: 37.5595,
    shopLongitude: 126.9225,
  },
  {
    designerId: 10,
    shopName: '블랙잉크 타투',
    category: '타투',
    shopLatitude: 37.555,
    shopLongitude: 126.9255,
  },

  // EYELASH 샵
  {
    designerId: 11,
    shopName: '래쉬 뷰티',
    category: '속눈썹',
    shopLatitude: 37.5573,
    shopLongitude: 126.9238,
  },
  {
    designerId: 12,
    shopName: '아이래쉬 스튜디오',
    category: '속눈썹',
    shopLatitude: 37.5563,
    shopLongitude: 126.9248,
  },
  {
    designerId: 13,
    shopName: '글램 래쉬',
    category: '속눈썹',
    shopLatitude: 37.5583,
    shopLongitude: 126.9228,
  },

  // 추가 클러스터링 테스트용 (같은 위치 근처)
  {
    designerId: 14,
    shopName: '헤어살롱 B',
    category: '헤어',
    shopLatitude: 37.5572,
    shopLongitude: 126.9237,
  },
  {
    designerId: 15,
    shopName: '네일샵 리본',
    category: '네일',
    shopLatitude: 37.5572,
    shopLongitude: 126.9238,
  },
];

/**
 * 컴포넌트에서 직접 사용할 수 있는 변환된 Mock 데이터
 * API 응답 형태(한글 category)를 UI 형태(영문 Category enum)로 변환
 */
export const mockMapShops: MapShopItem[] = mockMapShopsRaw.map((item) => ({
  designerId: item.designerId,
  shopName: item.shopName,
  category: categoryNameToCode(item.category) ?? 'HAIR',
  shopLatitude: item.shopLatitude,
  shopLongitude: item.shopLongitude,
}));
