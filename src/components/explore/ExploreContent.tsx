'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  ExploreHeader,
  CategoryTabs,
  SearchBar,
  SubCategoryChips,
  SortDropdown,
  RecruitmentCard,
  DesignerCard,
  RecruitmentCardSkeleton,
  DesignerCardSkeleton,
} from '@/src/components/explore';
import { CATEGORIES, SUB_CATEGORIES_BY_CATEGORY, SORT_OPTIONS } from '@/src/constants/explore';
import { useRecruitments, useDesigners } from '@/src/hooks/queries/explore';
import { useToggleRecruitmentLike, useToggleDesignerLike } from '@/src/hooks/queries/likes';
import { useUserLocation } from '@/src/hooks/custom';
import { useToast } from '@/src/hooks/common/useToast';
import type { Category, SubCategory, SortOption } from '@/src/types';

export default function ExploreContent() {
  // 상태 관리
  const [view, setView] = useState<'designer' | 'recruitment'>('recruitment');
  const [selectedCategory, setSelectedCategory] = useState<Category>('HAIR');
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | 'ALL'>('ALL');
  const [selectedSort, setSelectedSort] = useState<SortOption>('NEWEST');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { showToast } = useToast();

  // 위치 에러 핸들러 (콜백으로 처리하여 effect 내 setState 방지)
  const handleLocationError = useCallback(
    (errorMessage: string) => {
      showToast(errorMessage);
      setSelectedSort('NEWEST');
    },
    [showToast]
  );

  // 위치 정보 훅
  const { location, isLoading: isLocationLoading, requestLocation } = useUserLocation({
    onError: handleLocationError,
  });

  // Infinite scroll observer ref
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 거리순 정렬 시 위치 정보 필요 여부
  const needsLocation = selectedSort === 'DISTANCE';
  const hasLocation = !!location;

  // 거리순 정렬 선택 시 위치 요청
  const handleSortChange = (sort: SortOption) => {
    if (sort === 'DISTANCE' && !location && !isLocationLoading) {
      requestLocation();
    }
    setSelectedSort(sort);
  };

  // Query params
  const recruitmentParams = {
    category: selectedCategory,
    subCategory: selectedSubCategory === 'ALL' ? undefined : selectedSubCategory,
    keyword: searchKeyword || undefined,
    sortOption: selectedSort,
    userLatitude: needsLocation ? location?.latitude : undefined,
    userLongitude: needsLocation ? location?.longitude : undefined,
  };

  const designerParams = {
    category: selectedCategory,
    keyword: searchKeyword || undefined,
    sortOption: selectedSort,
    userLatitude: needsLocation ? location?.latitude : undefined,
    userLongitude: needsLocation ? location?.longitude : undefined,
  };

  // 거리순 정렬 시 위치 정보가 없으면 쿼리 비활성화
  const canQueryWithDistance = !needsLocation || hasLocation;

  // Query hooks
  const {
    data: recruitmentData,
    fetchNextPage: fetchNextRecruitments,
    hasNextPage: hasNextRecruitments,
    isFetchingNextPage: isFetchingNextRecruitments,
    isLoading: isLoadingRecruitments,
  } = useRecruitments({ ...recruitmentParams, enabled: view === 'recruitment' && canQueryWithDistance });

  const {
    data: designerData,
    fetchNextPage: fetchNextDesigners,
    hasNextPage: hasNextDesigners,
    isFetchingNextPage: isFetchingNextDesigners,
    isLoading: isLoadingDesigners,
  } = useDesigners({ ...designerParams, enabled: view === 'designer' && canQueryWithDistance });

  // Like mutations
  const { mutate: toggleRecruitmentLike } = useToggleRecruitmentLike();
  const { mutate: toggleDesignerLike } = useToggleDesignerLike();

  // Flatten paginated data
  const recruitments = recruitmentData?.pages.flatMap((page) => page.result.items) ?? [];
  const designers = designerData?.pages.flatMap((page) => page.result.items) ?? [];

  // Total count
  const totalRecruitments = recruitments.length;
  const totalDesigners = designers.length;

  // Infinite scroll callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting) {
        if (view === 'recruitment' && hasNextRecruitments && !isFetchingNextRecruitments) {
          fetchNextRecruitments();
        } else if (view === 'designer' && hasNextDesigners && !isFetchingNextDesigners) {
          fetchNextDesigners();
        }
      }
    },
    [
      view,
      hasNextRecruitments,
      hasNextDesigners,
      isFetchingNextRecruitments,
      isFetchingNextDesigners,
      fetchNextRecruitments,
      fetchNextDesigners,
    ]
  );

  // Setup Intersection Observer
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  // 거리순 정렬에서 위치 로딩 중이거나 데이터 로딩 중인 경우
  const isWaitingForLocation = needsLocation && !hasLocation && isLocationLoading;
  const isLoading = isWaitingForLocation || (view === 'recruitment' ? isLoadingRecruitments : isLoadingDesigners);
  const isFetchingNext = view === 'recruitment' ? isFetchingNextRecruitments : isFetchingNextDesigners;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <ExploreHeader view={view} onViewChange={setView} />

      {/* 카테고리 탭 */}
      <CategoryTabs
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => {
          setSelectedCategory(cat as Category);
          setSelectedSubCategory('ALL'); // 카테고리 변경 시 서브카테고리 리셋
        }}
      />

      {/* 검색 및 필터 영역 */}
      <div className="flex flex-col gap-3 px-4 py-4">
        {/* 검색바 */}
        <SearchBar value={searchKeyword} onChange={setSearchKeyword} />

        {/* 공고 탐색일 때만 서브 카테고리 칩 표시 */}
        {view === 'recruitment' && (
          <SubCategoryChips
            subCategories={SUB_CATEGORIES_BY_CATEGORY[selectedCategory]}
            selectedSubCategory={selectedSubCategory}
            onSubCategoryChange={(sub) => setSelectedSubCategory(sub as SubCategory | 'ALL')}
          />
        )}

        {/* 총 개수 및 정렬 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-body-2-medium text-black">전체</span>
            <span className="text-body-2-semibold text-gray-600">
              {view === 'recruitment' ? totalRecruitments : totalDesigners}
            </span>
          </div>
          <SortDropdown
            sortOptions={SORT_OPTIONS}
            selectedSort={selectedSort}
            onSortChange={(sort) => handleSortChange(sort as SortOption)}
          />
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 pb-6">
        {view === 'recruitment' ? (
          /* 공고 그리드 (2열) */
          <div className="grid grid-cols-2 gap-x-2 gap-y-6">
            {isLoading
              ? [0, 1, 2, 3, 4, 5].map((index) => (
                  <RecruitmentCardSkeleton key={index} isLeftColumn={index % 2 === 0} />
                ))
              : recruitments.map((recruitment, index) => (
                  <RecruitmentCard
                    key={recruitment.recruitmentId}
                    recruitment={recruitment}
                    isLeftColumn={index % 2 === 0}
                    onLikeToggle={() => toggleRecruitmentLike(recruitment.recruitmentId)}
                  />
                ))}
            {isFetchingNext &&
              [0, 1].map((index) => (
                <RecruitmentCardSkeleton key={`loading-${index}`} isLeftColumn={index % 2 === 0} />
              ))}
          </div>
        ) : (
          /* 디자이너 리스트 */
          <div className="flex flex-col gap-6 px-4">
            {isLoading
              ? [0, 1, 2, 3].map((index) => <DesignerCardSkeleton key={index} />)
              : designers.map((designer) => (
                  <DesignerCard
                    key={designer.designerId}
                    designer={designer}
                    onLikeToggle={() => toggleDesignerLike(designer.designerId)}
                  />
                ))}
            {isFetchingNext && [0, 1].map((index) => <DesignerCardSkeleton key={`loading-${index}`} />)}
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-4" />
      </div>
    </div>
  );
}
