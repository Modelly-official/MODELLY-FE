import { axiosInstance } from '../axios';
import { isMockEnabled } from '@/src/config/api';
import { mockMapShops } from '@/src/mocks/map';
import type { ApiResponse } from '@/src/types';
import type { MapShopItem, MapShopParams } from '@/src/types/map';

const DEFAULT_PAGE_SIZE = 50;

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
  const { data } = await axiosInstance.get<ApiResponse<MapShopItem[]>>(
    '/map/shops',
    { params: { ...restParams, size } }
  );
  return data;
}

// ===== Mock 함수 =====

function getMockMapShops(
  params: MapShopParams
): Promise<ApiResponse<MapShopItem[]>> {
  const { category, size = DEFAULT_PAGE_SIZE } = params;

  // 카테고리 필터링
  let filtered = [...mockMapShops];

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
