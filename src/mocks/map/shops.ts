import type { MapShopItem } from '@/src/types/map';

// 서울 주요 지역 기준 Mock 데이터
// 기본 좌표: 강남역 (37.4979, 127.0276)

export const mockMapShops: MapShopItem[] = [
  // HAIR 샵
  {
    designerId: 1,
    shopName: '헤어살롱 A',
    category: 'HAIR',
    shopLatitude: 37.4979,
    shopLongitude: 127.0276,
  },
  {
    designerId: 2,
    shopName: '스타일리시 헤어',
    category: 'HAIR',
    shopLatitude: 37.4985,
    shopLongitude: 127.0290,
  },
  {
    designerId: 3,
    shopName: '프리미엄 헤어샵',
    category: 'HAIR',
    shopLatitude: 37.4960,
    shopLongitude: 127.0255,
  },
  {
    designerId: 4,
    shopName: '트렌디 헤어',
    category: 'HAIR',
    shopLatitude: 37.5010,
    shopLongitude: 127.0310,
  },

  // NAIL 샵
  {
    designerId: 5,
    shopName: '네일아트 스튜디오',
    category: 'NAIL',
    shopLatitude: 37.4995,
    shopLongitude: 127.0265,
  },
  {
    designerId: 6,
    shopName: '프렌치 네일',
    category: 'NAIL',
    shopLatitude: 37.4970,
    shopLongitude: 127.0300,
  },
  {
    designerId: 7,
    shopName: '네일팩토리',
    category: 'NAIL',
    shopLatitude: 37.5005,
    shopLongitude: 127.0240,
  },

  // TATTOO 샵
  {
    designerId: 8,
    shopName: '잉크 스튜디오',
    category: 'TATTOO',
    shopLatitude: 37.4950,
    shopLongitude: 127.0285,
  },
  {
    designerId: 9,
    shopName: '아트 타투',
    category: 'TATTOO',
    shopLatitude: 37.5020,
    shopLongitude: 127.0250,
  },
  {
    designerId: 10,
    shopName: '블랙잉크 타투',
    category: 'TATTOO',
    shopLatitude: 37.4940,
    shopLongitude: 127.0320,
  },

  // EYELASH 샵
  {
    designerId: 11,
    shopName: '래쉬 뷰티',
    category: 'EYELASH',
    shopLatitude: 37.4988,
    shopLongitude: 127.0270,
  },
  {
    designerId: 12,
    shopName: '아이래쉬 스튜디오',
    category: 'EYELASH',
    shopLatitude: 37.4965,
    shopLongitude: 127.0295,
  },
  {
    designerId: 13,
    shopName: '글램 래쉬',
    category: 'EYELASH',
    shopLatitude: 37.5015,
    shopLongitude: 127.0260,
  },

  // 추가 클러스터링 테스트용 (같은 위치 근처)
  {
    designerId: 14,
    shopName: '헤어살롱 B',
    category: 'HAIR',
    shopLatitude: 37.4980,
    shopLongitude: 127.0277,
  },
  {
    designerId: 15,
    shopName: '네일샵 리본',
    category: 'NAIL',
    shopLatitude: 37.4981,
    shopLongitude: 127.0278,
  },
];
