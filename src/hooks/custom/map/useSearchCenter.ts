'use client';

import { useState, useMemo, useCallback } from 'react';
import { MAP_DEFAULTS } from '@/src/constants/map';
import type { MapPosition } from '@/src/types/map';

interface UseSearchCenterOptions {
  /** 사용자 현재 위치 */
  userLocation?: { latitude: number; longitude: number } | null;
  /** 위치 로딩 상태 */
  isLocationLoading?: boolean;
}

interface UseSearchCenterReturn {
  /** 현재 검색 기준 좌표 (API 호출용) */
  searchCenter: MapPosition | null;
  /** 수동 설정된 검색 좌표 */
  manualSearchCenter: MapPosition | null;
  /** 수동 검색 좌표 설정 */
  setManualSearchCenter: (center: MapPosition | null) => void;
  /** 현재 지도 중심으로 검색 좌표 업데이트 */
  updateSearchCenterTo: (center: MapPosition) => void;
}

/**
 * 검색 기준 좌표를 관리하는 hook
 * 우선순위: 수동 설정 > 사용자 위치 > 기본 좌표
 */
export function useSearchCenter({
  userLocation,
  isLocationLoading = false,
}: UseSearchCenterOptions = {}): UseSearchCenterReturn {
  // 수동 검색 좌표 ("현 지도에서 검색" 클릭 시 설정)
  const [manualSearchCenter, setManualSearchCenter] = useState<MapPosition | null>(null);

  // 검색 기준 좌표 계산: 수동 설정 > 사용자 위치 > 기본 좌표
  const searchCenter = useMemo<MapPosition | null>(() => {
    // 수동으로 설정된 검색 위치가 있으면 우선
    if (manualSearchCenter) return manualSearchCenter;
    // 사용자 위치가 있으면 사용
    if (userLocation) {
      return {
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      };
    }
    // 위치 로딩 완료 후에도 없으면 기본 좌표
    if (!isLocationLoading) return MAP_DEFAULTS.CENTER;
    // 아직 로딩 중이면 null
    return null;
  }, [manualSearchCenter, userLocation, isLocationLoading]);

  // 현재 지도 중심으로 검색 좌표 업데이트
  const updateSearchCenterTo = useCallback((center: MapPosition) => {
    setManualSearchCenter(center);
  }, []);

  return {
    searchCenter,
    manualSearchCenter,
    setManualSearchCenter,
    updateSearchCenterTo,
  };
}
