import { useQuery } from '@tanstack/react-query';
import { getMapShops } from '@/src/apis/map';
import type { MapShopParams, MapShopItem } from '@/src/types/map';
import type { ApiResponse } from '@/src/types';

export const mapKeys = {
  all: ['map'] as const,
  shops: () => [...mapKeys.all, 'shops'] as const,
  shopList: (params: MapShopParams) => [...mapKeys.shops(), params] as const,
};

interface UseMapShopsParams extends Omit<MapShopParams, 'userLatitude' | 'userLongitude'> {
  userLatitude?: number;
  userLongitude?: number;
  enabled?: boolean;
}

/**
 * 지도 샵 목록 조회 Hook
 * 위치 기반으로 마커에 표시할 샵 목록을 가져옵니다.
 */
export function useMapShops(params: UseMapShopsParams = {}) {
  const {
    enabled = true,
    userLatitude,
    userLongitude,
    ...queryParams
  } = params;

  // 위치 정보가 없으면 쿼리 비활성화
  const hasLocation = userLatitude !== undefined && userLongitude !== undefined;

  const fullParams: MapShopParams = {
    ...queryParams,
    userLatitude: userLatitude ?? 0,
    userLongitude: userLongitude ?? 0,
  };

  return useQuery<ApiResponse<MapShopItem[]>, Error>({
    queryKey: mapKeys.shopList(fullParams),
    queryFn: () => getMapShops(fullParams),
    enabled: enabled && hasLocation,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
