'use client';

import { ExploreHeader, ExploreFiltersSection, RecruitmentGrid, DesignerList } from '@/src/components/explore';
import { useExploreFilters, useExploreData, useInfiniteScroll } from '@/src/hooks/custom/explore';

/**
 * Explore 페이지의 메인 컨텐츠 컴포넌트
 * 필터 상태 관리, 데이터 fetching, UI 렌더링을 조합
 */
export default function ExploreContent() {
  // 필터 상태 관리
  const {
    filters,
    needsLocation,
    hasLocation,
    isLocationLoading,
    canQuery,
    setView,
    setCategory,
    setSubCategory,
    setSort,
    setKeyword,
    recruitmentParams,
    designerParams,
  } = useExploreFilters();

  // 데이터 fetching
  const {
    recruitments,
    designers,
    recruitmentTotalCount,
    designerTotalCount,
    isLoading,
    isFetchingNext,
    infiniteScrollProps,
    toggleRecruitmentLike,
    toggleDesignerLike,
  } = useExploreData({
    view: filters.view,
    recruitmentParams,
    designerParams,
    canQuery,
    needsLocation,
    hasLocation,
    isLocationLoading,
  });

  // Infinite scroll
  const { loadMoreRef } = useInfiniteScroll(infiniteScrollProps);

  // Total count (API 응답의 totalCount 사용)
  const totalCount = filters.view === 'recruitment' ? recruitmentTotalCount : designerTotalCount;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <ExploreHeader view={filters.view} onViewChange={setView} />

      {/* 필터 영역 */}
      <ExploreFiltersSection
        view={filters.view}
        category={filters.category}
        subCategory={filters.subCategory}
        sort={filters.sort}
        keyword={filters.keyword}
        totalCount={totalCount}
        onCategoryChange={setCategory}
        onSubCategoryChange={setSubCategory}
        onSortChange={setSort}
        onKeywordChange={setKeyword}
      />

      {/* 콘텐츠 영역 */}
      <div className="flex-1 pb-6">
        {filters.view === 'recruitment' ? (
          <RecruitmentGrid
            recruitments={recruitments}
            isLoading={isLoading}
            isFetchingNext={isFetchingNext}
            onLikeToggle={toggleRecruitmentLike}
          />
        ) : (
          <DesignerList
            designers={designers}
            isLoading={isLoading}
            isFetchingNext={isFetchingNext}
            onLikeToggle={toggleDesignerLike}
          />
        )}

        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-4" />
      </div>
    </div>
  );
}
