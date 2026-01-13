'use client';

import { useState, useMemo } from 'react';
import { NaverMapProvider } from '@/src/providers/NaverMapProvider';
import { NaverMapView } from '@/src/components/map';
import { useUserLocation } from '@/src/hooks/custom/useUserLocation';
import { useToast } from '@/src/hooks/common/useToast';
import { mockMapShops } from '@/src/mocks/map';
import type { MapPosition, MapShopItem } from '@/src/types/map';

// 서울 홍대입구역 기본 좌표
const DEFAULT_CENTER: MapPosition = {
  lat: 37.5571,
  lng: 126.9236,
};

function MapContent() {
  const { showToast } = useToast();
  const { location, isLoading: isLocationLoading } = useUserLocation({
    autoRequest: true,
    onError: (message) => showToast(message, 'error'),
  });

  // 사용자 위치가 있으면 해당 위치, 없으면 기본 좌표
  const initialCenter = useMemo<MapPosition>(() => {
    if (location) {
      return {
        lat: location.latitude,
        lng: location.longitude,
      };
    }
    return DEFAULT_CENTER;
  }, [location]);

  const [mapCenter, setMapCenter] = useState<MapPosition | null>(null);
  const [zoom, setZoom] = useState(15);

  // 실제 표시할 중심 좌표 (사용자가 지도를 움직이면 mapCenter, 아니면 initialCenter)
  const displayCenter = mapCenter ?? initialCenter;

  const handleCenterChanged = (newCenter: MapPosition) => {
    setMapCenter(newCenter);
  };

  const handleZoomChanged = (newZoom: number) => {
    setZoom(newZoom);
  };

  const handleShopClick = (shop: MapShopItem) => {
    // TODO: 샵 클릭 시 처리 (BottomSheet 열기 등)
    showToast(`${shop.shopName} 클릭`, 'success');
  };

  return (
    <div className="relative h-screen w-full">
      {/* 지도 */}
      <NaverMapView
        center={displayCenter}
        zoom={zoom}
        shops={mockMapShops}
        onCenterChanged={handleCenterChanged}
        onZoomChanged={handleZoomChanged}
        onShopClick={handleShopClick}
      />

      {/* 위치 로딩 중 표시 */}
      {isLocationLoading && (
        <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-2 shadow-md">
          <span className="text-body-2-medium text-gray-700">
            현재 위치를 가져오는 중...
          </span>
        </div>
      )}
    </div>
  );
}

export default function MapPage() {
  return (
    <NaverMapProvider>
      <MapContent />
    </NaverMapProvider>
  );
}
