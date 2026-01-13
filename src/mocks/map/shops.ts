import type { MapShopItem } from '@/src/types/map';

// 홍대입구역 기준 Mock 데이터
// 기본 좌표: 홍대입구역 (37.5571, 126.9236)

export const mockMapShops: MapShopItem[] = [
  // HAIR 샵
  {
    designerId: 1,
    shopName: '헤어살롱 A',
    category: 'HAIR',
    shopLatitude: 37.5571,
    shopLongitude: 126.9236,
  },
  {
    designerId: 2,
    shopName: '스타일리시 헤어',
    category: 'HAIR',
    shopLatitude: 37.5580,
    shopLongitude: 126.9250,
  },
  {
    designerId: 3,
    shopName: '프리미엄 헤어샵',
    category: 'HAIR',
    shopLatitude: 37.5560,
    shopLongitude: 126.9220,
  },
  {
    designerId: 4,
    shopName: '트렌디 헤어',
    category: 'HAIR',
    shopLatitude: 37.5590,
    shopLongitude: 126.9260,
  },

  // NAIL 샵
  {
    designerId: 5,
    shopName: '네일아트 스튜디오',
    category: 'NAIL',
    shopLatitude: 37.5575,
    shopLongitude: 126.9230,
  },
  {
    designerId: 6,
    shopName: '프렌치 네일',
    category: 'NAIL',
    shopLatitude: 37.5565,
    shopLongitude: 126.9245,
  },
  {
    designerId: 7,
    shopName: '네일팩토리',
    category: 'NAIL',
    shopLatitude: 37.5585,
    shopLongitude: 126.9215,
  },

  // TATTOO 샵
  {
    designerId: 8,
    shopName: '잉크 스튜디오',
    category: 'TATTOO',
    shopLatitude: 37.5555,
    shopLongitude: 126.9240,
  },
  {
    designerId: 9,
    shopName: '아트 타투',
    category: 'TATTOO',
    shopLatitude: 37.5595,
    shopLongitude: 126.9225,
  },
  {
    designerId: 10,
    shopName: '블랙잉크 타투',
    category: 'TATTOO',
    shopLatitude: 37.5550,
    shopLongitude: 126.9255,
  },

  // EYELASH 샵
  {
    designerId: 11,
    shopName: '래쉬 뷰티',
    category: 'EYELASH',
    shopLatitude: 37.5573,
    shopLongitude: 126.9238,
  },
  {
    designerId: 12,
    shopName: '아이래쉬 스튜디오',
    category: 'EYELASH',
    shopLatitude: 37.5563,
    shopLongitude: 126.9248,
  },
  {
    designerId: 13,
    shopName: '글램 래쉬',
    category: 'EYELASH',
    shopLatitude: 37.5583,
    shopLongitude: 126.9228,
  },

  // 추가 클러스터링 테스트용 (같은 위치 근처)
  {
    designerId: 14,
    shopName: '헤어살롱 B',
    category: 'HAIR',
    shopLatitude: 37.5572,
    shopLongitude: 126.9237,
  },
  {
    designerId: 15,
    shopName: '네일샵 리본',
    category: 'NAIL',
    shopLatitude: 37.5572,
    shopLongitude: 126.9238,
  },
];
