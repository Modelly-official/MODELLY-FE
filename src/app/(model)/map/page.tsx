'use client';

import { useState, useMemo, useCallback } from 'react';
import { NaverMapProvider } from '@/src/providers/NaverMapProvider';
import {
  NaverMapView,
  MapBottomSheet,
  MapRecruitmentCard,
  MapControls,
  SelectedShopCard,
  SHEET_HEIGHTS,
} from '@/src/components/map';
import { useUserLocation } from '@/src/hooks/custom/useUserLocation';
import { useMapShops } from '@/src/hooks/queries/map/useMapShops';
import { useToast } from '@/src/hooks/common/useToast';
import { mockRecruitmentItems } from '@/src/mocks/explore';
import type { MapPosition, MapShopItem } from '@/src/types/map';
import type { Category, SubCategory, SortOption } from '@/src/types/recruitment';

// 서울 홍대입구역 기본 좌표
const DEFAULT_CENTER: MapPosition = {
  lat: 37.5571,
  lng: 126.9236,
};

function MapContent() {
  const { showToast } = useToast();
  const { location, isLoading: isLocationLoading, requestLocation } = useUserLocation({
    autoRequest: true,
    onError: (message) => showToast(message),
  });

  // 지도 상태
  const [mapCenter, setMapCenter] = useState<MapPosition | null>(null);
  const [zoom, setZoom] = useState(15);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(SHEET_HEIGHTS.mid);
  const [selectedShop, setSelectedShop] = useState<MapShopItem | null>(null);
  const [selectedCardDragOffset, setSelectedCardDragOffset] = useState(0);

  // 수동 검색 좌표 ("현 지도에서 검색" 클릭 시 설정)
  const [manualSearchCenter, setManualSearchCenter] = useState<MapPosition | null>(null);

  // 필터 상태
  const [category, setCategory] = useState<Category>('HAIR');
  const [subCategory, setSubCategory] = useState<SubCategory | 'ALL'>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('DISTANCE');

  // 검색 기준 좌표 계산: 수동 설정 > 사용자 위치 > 기본 좌표
  const searchCenter = useMemo<MapPosition | null>(() => {
    // 수동으로 설정된 검색 위치가 있으면 우선
    if (manualSearchCenter) return manualSearchCenter;
    // 사용자 위치가 있으면 사용
    if (location) {
      return {
        lat: location.latitude,
        lng: location.longitude,
      };
    }
    // 위치 로딩 완료 후에도 없으면 기본 좌표
    if (!isLocationLoading) return DEFAULT_CENTER;
    // 아직 로딩 중이면 null
    return null;
  }, [manualSearchCenter, location, isLocationLoading]);

  // 지도 샵 목록 조회 API
  const { data: shopsData, isLoading: isShopsLoading } = useMapShops({
    userLatitude: searchCenter?.lat,
    userLongitude: searchCenter?.lng,
    category,
    enabled: !!searchCenter,
  });

  // 샵 목록 (API 응답 또는 빈 배열)
  const shops = shopsData?.result ?? [];

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

  // 현재 위치 마커용 좌표
  const userLocation = useMemo<MapPosition | null>(() => {
    if (location) {
      return {
        lat: location.latitude,
        lng: location.longitude,
      };
    }
    return null;
  }, [location]);

  // 실제 표시할 중심 좌표 (사용자가 지도를 움직이면 mapCenter, 아니면 initialCenter)
  const displayCenter = mapCenter ?? initialCenter;

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

  // 현 지도에서 검색
  const handleRefreshSearch = useCallback(() => {
    // 현재 지도 중심을 검색 기준으로 설정
    setManualSearchCenter(displayCenter);
    setSelectedShop(null);
    setSelectedCardDragOffset(0);
    // refetch는 searchCenter가 변경되면 자동으로 트리거됨 (queryKey 변경)
    showToast('현재 지도 영역에서 검색합니다');
  }, [displayCenter, showToast]);

  // 현재 위치로 이동
  const handleCurrentLocation = useCallback(() => {
    if (location) {
      setMapCenter({
        lat: location.latitude,
        lng: location.longitude,
      });
    } else {
      requestLocation();
    }
  }, [location, requestLocation]);

  // 카테고리별 필터링된 공고 리스트 (mock)
  const filteredRecruitments = useMemo(() => {
    return mockRecruitmentItems.filter((item) => {
      // 카테고리 필터
      if (item.category !== category) return false;
      // 서브카테고리 필터
      if (subCategory !== 'ALL' && !item.subCategories.includes(subCategory)) return false;
      return true;
    });
  }, [category, subCategory]);

  // 선택된 샵에 해당하는 공고 찾기 (mock - 같은 카테고리의 첫 번째 공고)
  const selectedRecruitment = useMemo(() => {
    if (!selectedShop) return null;
    return mockRecruitmentItems.find((item) => item.category === selectedShop.category) ?? null;
  }, [selectedShop]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 지도 */}
      <NaverMapView
        center={displayCenter}
        zoom={zoom}
        shops={shops}
        selectedDesignerId={selectedShop?.designerId}
        userLocation={userLocation}
        onCenterChanged={handleCenterChanged}
        onZoomChanged={handleZoomChanged}
        onShopClick={handleShopClick}
      />

      {/* 지도 컨트롤 버튼 */}
      <MapControls
        onRefreshSearch={handleRefreshSearch}
        onCurrentLocation={handleCurrentLocation}
        showRefreshButton={!isLocationLoading}
        bottomSheetHeight={bottomSheetHeight}
        isSelectedShopCard={!!selectedShop && !!selectedRecruitment}
        selectedCardDragOffset={selectedCardDragOffset}
      />

      {/* 위치 로딩 중 표시 */}
      {(isLocationLoading || isShopsLoading) && (
        <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-2 shadow-md">
          <span className="text-body-2-medium text-gray-700">
            {isLocationLoading ? '현재 위치를 가져오는 중...' : '샵을 검색하는 중...'}
          </span>
        </div>
      )}

      {/* 선택된 샵 카드 또는 BottomSheet */}
      {selectedShop && selectedRecruitment ? (
        <SelectedShopCard
          shop={selectedShop}
          recruitment={selectedRecruitment}
          onClose={handleCloseSelectedShop}
          onDragOffsetChange={setSelectedCardDragOffset}
        />
      ) : (
        <MapBottomSheet
          category={category}
          subCategory={subCategory}
          sortOption={sortOption}
          totalCount={filteredRecruitments.length}
          onCategoryChange={setCategory}
          onSubCategoryChange={setSubCategory}
          onSortChange={setSortOption}
          onHeightChange={setBottomSheetHeight}
        >
          {/* 공고 리스트 - 세로 스크롤 */}
          <div className="flex flex-col gap-4">
            {filteredRecruitments.map((recruitment) => (
              <MapRecruitmentCard
                key={recruitment.recruitmentId}
                recruitment={recruitment}
              />
            ))}
          </div>
        </MapBottomSheet>
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
