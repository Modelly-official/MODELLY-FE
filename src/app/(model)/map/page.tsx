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
import { useToast } from '@/src/hooks/common/useToast';
import { mockMapShops } from '@/src/mocks/map';
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

  // 필터 상태
  const [category, setCategory] = useState<Category>('HAIR');
  const [subCategory, setSubCategory] = useState<SubCategory | 'ALL'>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('DISTANCE');

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
    // TODO: API 연결 시 현재 지도 영역 기준으로 재검색
    setSelectedShop(null); // 선택된 샵 카드 닫기
    setSelectedCardDragOffset(0);
    showToast('현재 지도 영역에서 검색합니다');
  }, [showToast]);

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
        shops={mockMapShops}
        selectedShopId={selectedShop?.shopId}
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
      {isLocationLoading && (
        <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-2 shadow-md">
          <span className="text-body-2-medium text-gray-700">
            현재 위치를 가져오는 중...
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
