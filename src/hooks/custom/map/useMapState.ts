'use client';

import { useState, useCallback, useMemo } from 'react';
import { SHEET_HEIGHTS, MAP_DEFAULTS } from '@/src/constants/map';
import type { MapPosition, MapShopItem } from '@/src/types/map';

interface UseMapStateOptions {
  /** 사용자 현재 위치 (위치 hook에서 제공) */
  userLocation?: { latitude: number; longitude: number } | null;
}

interface UseMapStateReturn {
  // 상태값
  mapCenter: MapPosition | null;
  zoom: number;
  bottomSheetHeight: number;
  selectedShop: MapShopItem | null;
  selectedCardDragOffset: number;

  // 계산된 값
  initialCenter: MapPosition;
  displayCenter: MapPosition;
  userLocationAsMapPosition: MapPosition | null;

  // 핸들러
  handleCenterChanged: (center: MapPosition) => void;
  handleZoomChanged: (zoom: number) => void;
  handleShopClick: (shop: MapShopItem) => void;
  handleCloseSelectedShop: () => void;
  setBottomSheetHeight: (height: number) => void;
  setSelectedCardDragOffset: (offset: number) => void;
  setMapCenter: (center: MapPosition | null) => void;
}

/**
 * Map 페이지의 지도 관련 상태를 관리하는 hook
 * - 지도 중심, 줌, 선택된 샵, BottomSheet 높이 등
 */
export function useMapState({ userLocation }: UseMapStateOptions = {}): UseMapStateReturn {
  // 지도 상태
  const [mapCenter, setMapCenter] = useState<MapPosition | null>(null);
  const [zoom, setZoom] = useState(MAP_DEFAULTS.ZOOM);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(SHEET_HEIGHTS.mid);
  const [selectedShop, setSelectedShop] = useState<MapShopItem | null>(null);
  const [selectedCardDragOffset, setSelectedCardDragOffset] = useState(0);

  // 사용자 위치가 있으면 해당 위치, 없으면 기본 좌표
  const initialCenter = useMemo<MapPosition>(() => {
    if (userLocation) {
      return {
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      };
    }
    return MAP_DEFAULTS.CENTER;
  }, [userLocation]);

  // 실제 표시할 중심 좌표 (사용자가 지도를 움직이면 mapCenter, 아니면 initialCenter)
  const displayCenter = mapCenter ?? initialCenter;

  // 현재 위치 마커용 좌표
  const userLocationAsMapPosition = useMemo<MapPosition | null>(() => {
    if (userLocation) {
      return {
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      };
    }
    return null;
  }, [userLocation]);

  // 핸들러
  const handleCenterChanged = useCallback((newCenter: MapPosition) => {
    setMapCenter(newCenter);
  }, []);

  const handleZoomChanged = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleShopClick = useCallback((shop: MapShopItem) => {
    setSelectedShop(shop);
  }, []);

  const handleCloseSelectedShop = useCallback(() => {
    setSelectedShop(null);
    setSelectedCardDragOffset(0);
  }, []);

  return {
    // 상태값
    mapCenter,
    zoom,
    bottomSheetHeight,
    selectedShop,
    selectedCardDragOffset,

    // 계산된 값
    initialCenter,
    displayCenter,
    userLocationAsMapPosition,

    // 핸들러
    handleCenterChanged,
    handleZoomChanged,
    handleShopClick,
    handleCloseSelectedShop,
    setBottomSheetHeight,
    setSelectedCardDragOffset,
    setMapCenter,
  };
}
