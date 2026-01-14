'use client';

import { useState, useCallback } from 'react';
import type { Category, SubCategory, SortOption } from '@/src/types/recruitment';

interface UseMapFiltersReturn {
  // 상태값
  category: Category;
  subCategory: SubCategory | 'ALL';
  sortOption: SortOption;

  // 핸들러
  setCategory: (category: Category) => void;
  setSubCategory: (subCategory: SubCategory | 'ALL') => void;
  setSortOption: (sortOption: SortOption) => void;
  resetFilters: () => void;
}

const DEFAULT_CATEGORY: Category = 'HAIR';
const DEFAULT_SUB_CATEGORY: SubCategory | 'ALL' = 'ALL';
const DEFAULT_SORT_OPTION: SortOption = 'DISTANCE';

/**
 * Map 페이지의 필터 상태를 관리하는 hook
 * - 카테고리, 서브카테고리, 정렬 옵션
 */
export function useMapFilters(): UseMapFiltersReturn {
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);
  const [subCategory, setSubCategory] = useState<SubCategory | 'ALL'>(DEFAULT_SUB_CATEGORY);
  const [sortOption, setSortOption] = useState<SortOption>(DEFAULT_SORT_OPTION);

  const resetFilters = useCallback(() => {
    setCategory(DEFAULT_CATEGORY);
    setSubCategory(DEFAULT_SUB_CATEGORY);
    setSortOption(DEFAULT_SORT_OPTION);
  }, []);

  return {
    category,
    subCategory,
    sortOption,
    setCategory,
    setSubCategory,
    setSortOption,
    resetFilters,
  };
}
