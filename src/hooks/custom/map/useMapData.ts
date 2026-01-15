'use client';

import { useMemo } from 'react';
import { useMapShops } from '@/src/hooks/queries/map/useMapShops';
import { useRecruitments } from '@/src/hooks/queries/explore/useRecruitments';
import { usePublicDesignerProfile } from '@/src/hooks/queries/profile';
import { useToggleRecruitmentLike, useToggleDesignerLike } from '@/src/hooks/queries/likes';
import type { MapPosition, MapShopItem } from '@/src/types/map';
import type { Category, SubCategory, SortOption } from '@/src/types/recruitment';

interface UseMapDataOptions {
  /** 검색 기준 좌표 */
  searchCenter: MapPosition | null;
  /** 선택된 카테고리 */
  category: Category;
  /** 선택된 서브카테고리 */
  subCategory: SubCategory | 'ALL';
  /** 정렬 옵션 */
  sortOption: SortOption;
  /** 선택된 샵 */
  selectedShop: MapShopItem | null;
}

/**
 * Map 페이지의 데이터 fetching을 통합 관리하는 hook
 * - 샵 목록 조회
 * - 공고 목록 조회 (무한 스크롤)
 * - 선택된 샵의 디자이너 프로필 조회
 * - 좋아요 mutation
 */
export function useMapData({
  searchCenter,
  category,
  subCategory,
  sortOption,
  selectedShop,
}: UseMapDataOptions) {
  // 지도 샵 목록 조회 API (전체 카테고리 표시)
  const {
    data: shopsData,
    isLoading: isShopsLoading,
    refetch: refetchShops,
  } = useMapShops({
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

  // 선택된 샵의 디자이너 공개 프로필 조회 API
  const { data: profileData, isLoading: isProfileLoading } = usePublicDesignerProfile({
    designerId: selectedShop?.designerId ?? null,
    enabled: !!selectedShop,
  });

  // 선택된 샵의 프로필 및 공고 정보
  const designerProfile = profileData?.result?.profile ?? null;
  const designerRecruitments = profileData?.result?.openRecruitments ?? [];

  // 찜(좋아요) mutation
  const { mutate: toggleRecruitmentLike } = useToggleRecruitmentLike();
  const { mutate: toggleDesignerLike } = useToggleDesignerLike();

  // refetch 함수 (현 지도에서 검색용)
  const refetchAll = () => {
    refetchShops();
    refetchRecruitments();
  };

  return {
    // 샵 데이터
    shops,
    isShopsLoading,
    refetchShops,

    // 공고 데이터
    recruitments,
    isRecruitmentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetchRecruitments,

    // 선택된 샵 프로필 데이터
    designerProfile,
    designerRecruitments,
    isProfileLoading,

    // 좋아요 mutation
    toggleRecruitmentLike,
    toggleDesignerLike,

    // 통합 refetch
    refetchAll,
  };
}
