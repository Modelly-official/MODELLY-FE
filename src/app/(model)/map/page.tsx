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
import { useRecruitments } from '@/src/hooks/queries/explore/useRecruitments';
import { useToggleRecruitmentLike } from '@/src/hooks/queries/likes';
import { usePublicDesignerProfile } from '@/src/hooks/queries/profile';
import { useToast } from '@/src/hooks/common/useToast';
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

  // 지도 샵 목록 조회 API (전체 카테고리 표시)
  const { data: shopsData, isLoading: isShopsLoading, refetch: refetchShops } = useMapShops({
    userLatitude: searchCenter?.lat,
    userLongitude: searchCenter?.lng,
    // category 미전달 시 전체 표시
    enabled: !!searchCenter,
  });

  // 샵 목록 (API 응답 또는 빈 배열)
  const shops = shopsData?.result ?? [];

  // 공고 목록 조회 API (무한 스크롤)
  const {
    data: recruitmentsData,
    isLoading: isRecruitmentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  refetch: refetchRecruitments,
  } = useRecruitments({
    category,
    subCategory: subCategory !== 'ALL' ? subCategory : undefined,
    sortOption,
    userLatitude: searchCenter?.lat,
    userLongitude: searchCenter?.lng,
    enabled: !!searchCenter,
    mockEndpoint: 'mapRecruitments', // map 전용 mock 설정
  });

  // 찜(좋아요) mutation
  const { mutate: toggleRecruitmentLike } = useToggleRecruitmentLike();

  // 선택된 샵의 디자이너 공개 프로필 조회 API
  const {
    data: profileData,
    isLoading: isProfileLoading,
  } = usePublicDesignerProfile({
    designerId: selectedShop?.designerId ?? null,
    enabled: !!selectedShop,
  });

  // 공고 목록 (전체 페이지 합침 + 중복 제거)
  const recruitments = useMemo(() => {
    if (!recruitmentsData?.pages) return [];
    const allItems = recruitmentsData.pages.flatMap((page) => page.result.items);
    // recruitmentId 기준 중복 제거
    const seen = new Set<number>();
    return allItems.filter((item) => {
      if (seen.has(item.recruitmentId)) return false;
      seen.add(item.recruitmentId);
      return true;
    });
  }, [recruitmentsData]);

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
    // 좌표가 같아도 강제로 refetch (캐시된 데이터 무시)
    refetchShops();
    refetchRecruitments();
    showToast('현재 지도 영역에서 검색합니다');
  }, [displayCenter, showToast, refetchShops, refetchRecruitments]);

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

  // 선택된 샵의 프로필 및 공고 정보
  const designerProfile = profileData?.result?.profile ?? null;
  const designerRecruitments = profileData?.result?.openRecruitments ?? [];

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
        isSelectedShopCard={!!selectedShop && !!designerProfile}
        selectedCardDragOffset={selectedCardDragOffset}
      />

      {/* 위치 로딩 중 표시 */}
      {(isLocationLoading || isShopsLoading || isRecruitmentsLoading) && (
        <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-2 shadow-md">
          <span className="text-body-2-medium text-gray-700">
            {isLocationLoading ? '현재 위치를 가져오는 중...' : isShopsLoading ? '샵을 검색하는 중...' : '공고를 불러오는 중...'}
          </span>
        </div>
      )}

      {/* 선택된 샵 프로필 로딩 중 표시 */}
      {selectedShop && isProfileLoading && (
        <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-2 shadow-md">
          <span className="text-body-2-medium text-gray-700">디자이너 정보를 불러오는 중...</span>
        </div>
      )}

      {/* 선택된 샵 카드 또는 BottomSheet */}
      {selectedShop && designerProfile ? (
        <SelectedShopCard
          shop={selectedShop}
          profile={designerProfile}
          recruitments={designerRecruitments}
          onClose={handleCloseSelectedShop}
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
          {/* 공고 리스트 - 세로 스크롤 */}
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
