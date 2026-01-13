'use client';

import { useMemo } from 'react';
import { useRecruitments, useDesigners } from '@/src/hooks/queries/explore';
import { useToggleRecruitmentLike, useToggleDesignerLike } from '@/src/hooks/queries/likes';
import type { ExploreView, RecruitmentQueryParams, DesignerQueryParams } from './useExploreFilters';

interface UseExploreDataParams {
  view: ExploreView;
  recruitmentParams: RecruitmentQueryParams;
  designerParams: DesignerQueryParams;
  canQuery: boolean;
  needsLocation: boolean;
  hasLocation: boolean;
  isLocationLoading: boolean;
}

/**
 * Explore 페이지의 데이터 fetching 로직을 추상화한 Hook
 */
export function useExploreData({
  view,
  recruitmentParams,
  designerParams,
  canQuery,
  needsLocation,
  hasLocation,
  isLocationLoading,
}: UseExploreDataParams) {
  // Query hooks
  const {
    data: recruitmentData,
    fetchNextPage: fetchNextRecruitments,
    hasNextPage: hasNextRecruitments,
    isFetchingNextPage: isFetchingNextRecruitments,
    isLoading: isLoadingRecruitments,
  } = useRecruitments({ ...recruitmentParams, enabled: view === 'recruitment' && canQuery });

  const {
    data: designerData,
    fetchNextPage: fetchNextDesigners,
    hasNextPage: hasNextDesigners,
    isFetchingNextPage: isFetchingNextDesigners,
    isLoading: isLoadingDesigners,
  } = useDesigners({ ...designerParams, enabled: view === 'designer' && canQuery });

  // Like mutations
  const { mutate: toggleRecruitmentLike } = useToggleRecruitmentLike();
  const { mutate: toggleDesignerLike } = useToggleDesignerLike();

  // Flatten paginated data + 중복 제거
  const recruitments = useMemo(() => {
    if (!recruitmentData?.pages) return [];
    const allItems = recruitmentData.pages.flatMap((page) => page.result.items);
    const seen = new Set<number>();
    return allItems.filter((item) => {
      if (seen.has(item.recruitmentId)) return false;
      seen.add(item.recruitmentId);
      return true;
    });
  }, [recruitmentData]);

  const designers = useMemo(() => {
    if (!designerData?.pages) return [];
    const allItems = designerData.pages.flatMap((page) => page.result.items);
    const seen = new Set<number>();
    return allItems.filter((item) => {
      if (seen.has(item.designerId)) return false;
      seen.add(item.designerId);
      return true;
    });
  }, [designerData]);

  // Loading states
  const isWaitingForLocation = needsLocation && !hasLocation && isLocationLoading;
  const isLoading = isWaitingForLocation || (view === 'recruitment' ? isLoadingRecruitments : isLoadingDesigners);
  const isFetchingNext = view === 'recruitment' ? isFetchingNextRecruitments : isFetchingNextDesigners;

  // Infinite scroll props
  const infiniteScrollProps = {
    hasNextPage: view === 'recruitment' ? hasNextRecruitments : hasNextDesigners,
    isFetchingNextPage: isFetchingNext,
    fetchNextPage: view === 'recruitment' ? fetchNextRecruitments : fetchNextDesigners,
  };

  return {
    recruitments,
    designers,
    isLoading,
    isFetchingNext,
    infiniteScrollProps,
    toggleRecruitmentLike,
    toggleDesignerLike,
  };
}
