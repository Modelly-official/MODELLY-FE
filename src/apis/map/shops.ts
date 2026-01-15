import { axiosInstance } from '../axios';
import { isMockEnabled } from '@/src/config/api';
import { mockMapShopsRaw } from '@/src/mocks/map';
import { categoryNameToCode } from '@/src/utils/myRecruitment/category/categoryMapping';
import type { ApiResponse } from '@/src/types';
import type {
  MapShopItem,
  MapShopApiItem,
  MapShopParams,
  MapShopApiResponse,
} from '@/src/types/map';

const DEFAULT_PAGE_SIZE = 50;

/**
 * API 원본 응답을 UI용 타입으로 변환
 * - category: 한글 → 영문 enum
 */
function convertApiItemToMapShopItem(apiItem: MapShopApiItem): MapShopItem {
  const categoryCode = categoryNameToCode(apiItem.category);

  return {
    designerId: apiItem.designerId,
    shopName: apiItem.shopName,
    category: categoryCode ?? 'HAIR', // fallback
    shopLatitude: apiItem.shopLatitude,
    shopLongitude: apiItem.shopLongitude,
  };
}

/**
 * 지도 샵 목록 조회
 * GET /map/shops
 */
export async function getMapShops(
  params: MapShopParams
): Promise<ApiResponse<MapShopItem[]>> {
  if (isMockEnabled('mapShops')) {
    return getMockMapShops(params);
  }

  const { size = DEFAULT_PAGE_SIZE, ...restParams } = params;
  const { data } = await axiosInstance.get<MapShopApiResponse>('/map/shops', {
    params: { ...restParams, size },
  });

  // API 응답 변환 (null/undefined 방어)
  return {
    ...data,
    result: Array.isArray(data.result) ? data.result.map(convertApiItemToMapShopItem) : [],
  };
}

// ===== Mock 함수 =====

function getMockMapShops(
  params: MapShopParams
): Promise<ApiResponse<MapShopItem[]>> {
  const { category, size = DEFAULT_PAGE_SIZE } = params;

  // 변환된 데이터
  const convertedShops = mockMapShopsRaw.map(convertApiItemToMapShopItem);

  // 카테고리 필터링 (변환 후 영문 기준)
  let filtered = [...convertedShops];

  if (category) {
    filtered = filtered.filter((item) => item.category === category);
  }

  // size 제한
  const items = filtered.slice(0, size);

  return Promise.resolve({
    isSuccess: true,
    code: 'SUCCESS',
    message: '지도 샵 목록 조회 성공',
    result: items,
  });
}
