'use client';

import { useState, useCallback } from 'react';
import { useUserLocation } from '@/src/hooks/custom/useUserLocation';
import { useToast } from '@/src/hooks/common/useToast';
import type { Category, SubCategory, SortOption } from '@/src/types';

export type ExploreView = 'designer' | 'recruitment';

export interface ExploreFiltersState {
  view: ExploreView;
  category: Category;
  subCategory: SubCategory | 'ALL';
  sort: SortOption;
  keyword: string;
}

export interface RecruitmentQueryParams {
  category: Category;
  subCategory?: SubCategory;
  keyword?: string;
  sortOption: SortOption;
  userLatitude?: number;
  userLongitude?: number;
}

export interface DesignerQueryParams {
  category: Category;
  keyword?: string;
  sortOption: SortOption;
  userLatitude?: number;
  userLongitude?: number;
}

export interface UseExploreFiltersReturn {
  // State
  filters: ExploreFiltersState;
  location: { latitude: number; longitude: number } | null;
  isLocationLoading: boolean;

  // Derived state
  needsLocation: boolean;
  hasLocation: boolean;
  canQuery: boolean;

  // Actions
  setView: (view: ExploreView) => void;
  setCategory: (category: Category) => void;
  setSubCategory: (subCategory: SubCategory | 'ALL') => void;
  setSort: (sort: SortOption) => void;
  setKeyword: (keyword: string) => void;

  // Query params
  recruitmentParams: RecruitmentQueryParams;
  designerParams: DesignerQueryParams;
}

const DEFAULT_STATE: ExploreFiltersState = {
  view: 'recruitment',
  category: 'HAIR',
  subCategory: 'ALL',
  sort: 'NEWEST',
  keyword: '',
};

/**
 * Explore 페이지의 필터 상태를 관리하는 커스텀 훅
 * - 뷰 전환 (공고/디자이너)
 * - 카테고리, 서브카테고리, 정렬, 검색어 상태 관리
 * - 위치 정보 연동 (거리순 정렬 시)
 * - API 쿼리 파라미터 자동 생성
 */
export function useExploreFilters(
  initialState: Partial<ExploreFiltersState> = {}
): UseExploreFiltersReturn {
  const { showToast } = useToast();

  // 필터 상태
  const [filters, setFilters] = useState<ExploreFiltersState>({
    ...DEFAULT_STATE,
    ...initialState,
  });

  // 위치 에러 핸들러
  const handleLocationError = useCallback(
    (errorMessage: string) => {
      showToast(errorMessage);
      setFilters((prev) => ({ ...prev, sort: 'NEWEST' }));
    },
    [showToast]
  );

  // 위치 정보 훅
  const {
    location,
    isLoading: isLocationLoading,
    requestLocation,
  } = useUserLocation({
    onError: handleLocationError,
  });

  // 파생 상태
  const needsLocation = filters.sort === 'DISTANCE';
  const hasLocation = !!location;
  const canQuery = !needsLocation || hasLocation;

  // Actions
  const setView = useCallback((view: ExploreView) => {
    setFilters((prev) => ({ ...prev, view }));
  }, []);

  const setCategory = useCallback((category: Category) => {
    setFilters((prev) => ({
      ...prev,
      category,
      subCategory: 'ALL', // 카테고리 변경 시 서브카테고리 리셋
    }));
  }, []);

  const setSubCategory = useCallback((subCategory: SubCategory | 'ALL') => {
    setFilters((prev) => ({ ...prev, subCategory }));
  }, []);

  const setSort = useCallback(
    (sort: SortOption) => {
      if (sort === 'DISTANCE' && !location && !isLocationLoading) {
        requestLocation();
      }
      setFilters((prev) => ({ ...prev, sort }));
    },
    [location, isLocationLoading, requestLocation]
  );

  const setKeyword = useCallback((keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword }));
  }, []);

  // Query params 생성
  const recruitmentParams: RecruitmentQueryParams = {
    category: filters.category,
    subCategory: filters.subCategory === 'ALL' ? undefined : filters.subCategory,
    keyword: filters.keyword || undefined,
    sortOption: filters.sort,
    userLatitude: location?.latitude,
    userLongitude: location?.longitude,
  };

  const designerParams: DesignerQueryParams = {
    category: filters.category,
    keyword: filters.keyword || undefined,
    sortOption: filters.sort,
    userLatitude: location?.latitude,
    userLongitude: location?.longitude,
  };

  return {
    filters,
    location,
    isLocationLoading,
    needsLocation,
    hasLocation,
    canQuery,
    setView,
    setCategory,
    setSubCategory,
    setSort,
    setKeyword,
    recruitmentParams,
    designerParams,
  };
}
