'use client';

import { useCallback } from 'react';
import { NaverMapProvider } from '@/src/providers/NaverMapProvider';
import {
  NaverMapView,
  MapBottomSheet,
  MapRecruitmentCard,
  MapControls,
  SelectedShopCard,
  MapLoadingIndicator,
  getLoadingMessage,
} from '@/src/components/map';
import { useUserLocation } from '@/src/hooks/custom/useUserLocation';
import { useMapState, useMapFilters, useSearchCenter, useMapData } from '@/src/hooks/custom/map';
import { useToast } from '@/src/hooks/common/useToast';

function MapContent() {
  const { showToast } = useToast();

  // 사용자 위치 hook
  const { location, isLoading: isLocationLoading, requestLocation } = useUserLocation({
    autoRequest: true,
    onError: (message) => showToast(message),
  });

  // 지도 상태 관리
  const {
    zoom,
    bottomSheetHeight,
    selectedShop,
    selectedCardDragOffset,
    displayCenter,
    userLocationAsMapPosition,
    handleCenterChanged,
    handleZoomChanged,
    handleShopClick,
    handleCloseSelectedShop,
    setBottomSheetHeight,
    setSelectedCardDragOffset,
    setMapCenter,
  } = useMapState({ userLocation: location });

  // 필터 상태 관리
  const { category, subCategory, sortOption, setCategory, setSubCategory, setSortOption } =
    useMapFilters();

  // 검색 기준 좌표 관리
  const { searchCenter, updateSearchCenterTo } = useSearchCenter({
    userLocation: location,
    isLocationLoading,
  });

  // 데이터 fetching (샵, 공고, 프로필)
  const {
    shops,
    isShopsLoading,
    recruitments,
    isRecruitmentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    designerProfile,
    designerRecruitments,
    isProfileLoading,
    toggleRecruitmentLike,
    toggleDesignerLike,
    refetchAll,
  } = useMapData({
    searchCenter,
    category,
    subCategory,
    sortOption,
    selectedShop,
  });

  // 현 지도에서 검색
  const handleRefreshSearch = useCallback(() => {
    updateSearchCenterTo(displayCenter);
    handleCloseSelectedShop();
    refetchAll();
    showToast('현재 지도 영역에서 검색합니다');
  }, [displayCenter, updateSearchCenterTo, handleCloseSelectedShop, refetchAll, showToast]);

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
  }, [location, requestLocation, setMapCenter]);

  // 로딩 메시지 계산
  const loadingMessage = getLoadingMessage({
    isLocationLoading,
    isShopsLoading,
    isRecruitmentsLoading,
  });

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 지도 */}
      <NaverMapView
        center={displayCenter}
        zoom={zoom}
        shops={shops}
        selectedDesignerId={selectedShop?.designerId}
        userLocation={userLocationAsMapPosition}
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
        isSelectedShopCard={!!selectedShop && !!designerProfile}
        selectedCardDragOffset={selectedCardDragOffset}
      />

      {/* 로딩 인디케이터 */}
      {loadingMessage && <MapLoadingIndicator message={loadingMessage} />}

      {/* 선택된 샵 프로필 로딩 중 표시 */}
      {selectedShop && isProfileLoading && (
        <MapLoadingIndicator message="디자이너 정보를 불러오는 중..." />
      )}

      {/* 선택된 샵 카드 또는 BottomSheet */}
      {selectedShop && designerProfile ? (
        <SelectedShopCard
          shop={selectedShop}
          profile={designerProfile}
          recruitments={designerRecruitments}
          onClose={handleCloseSelectedShop}
          onDesignerLikeToggle={() => toggleDesignerLike(selectedShop.designerId)}
          onDragOffsetChange={setSelectedCardDragOffset}
        />
      ) : !selectedShop ? (
        <MapBottomSheet
          category={category}
          subCategory={subCategory}
          sortOption={sortOption}
          totalCount={recruitments.length}
          onCategoryChange={setCategory}
          onSubCategoryChange={setSubCategory}
          onSortChange={setSortOption}
          onHeightChange={setBottomSheetHeight}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        >
          {/* 공고 리스트 */}
          <div className="flex flex-col gap-4">
            {recruitments.map((recruitment) => (
              <MapRecruitmentCard
                key={recruitment.recruitmentId}
                recruitment={recruitment}
                onLikeToggle={() => toggleRecruitmentLike(recruitment.recruitmentId)}
              />
            ))}
            {isFetchingNextPage && (
              <div className="py-3 text-center">
                <span className="text-body-2-medium text-gray-600">불러오는 중...</span>
              </div>
            )}
          </div>
        </MapBottomSheet>
      ) : null}
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
