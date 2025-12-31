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

  // Flatten paginated data
  const recruitments = useMemo(
    () => recruitmentData?.pages.flatMap((page) => page.result.items) ?? [],
    [recruitmentData]
  );

  const designers = useMemo(() => designerData?.pages.flatMap((page) => page.result.items) ?? [], [designerData]);

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
