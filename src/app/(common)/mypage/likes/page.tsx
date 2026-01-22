'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import {
  LikesPageTabs,
  LikesCategoryChips,
  LikedDesignerList,
  LikedRecruitmentGrid,
} from '@/src/components/mypage/likes';
import type { LikesTabType } from '@/src/components/mypage/likes';
import type { LikesCategoryFilter, Category } from '@/src/types';
import { useLikedDesigners, useLikedRecruitments } from '@/src/hooks/queries/likes';
import { useInfiniteScroll } from '@/src/hooks/common/useInfiniteScroll';

export default function LikesPage() {
  const router = useRouter();

  // 탭 상태
  const [activeTab, setActiveTab] = useState<LikesTabType>('designer');

  // 카테고리 필터 상태 (탭별 독립)
  const [designerCategory, setDesignerCategory] = useState<LikesCategoryFilter>('ALL');
  const [recruitmentCategory, setRecruitmentCategory] = useState<LikesCategoryFilter>('ALL');

  // 현재 탭에 따른 카테고리 상태
  const currentCategory = activeTab === 'designer' ? designerCategory : recruitmentCategory;
  const setCurrentCategory = activeTab === 'designer' ? setDesignerCategory : setRecruitmentCategory;

  // 카테고리 필터 파라미터 변환 (ALL이면 undefined)
  const designerCategoryParam = designerCategory === 'ALL' ? undefined : (designerCategory as Category);
  const recruitmentCategoryParam = recruitmentCategory === 'ALL' ? undefined : (recruitmentCategory as Category);

  // 찜한 디자이너 목록 조회
  const {
    data: designerData,
    isLoading: isDesignerLoading,
    hasNextPage: hasDesignerNextPage,
    isFetchingNextPage: isFetchingDesignerNextPage,
    fetchNextPage: fetchDesignerNextPage,
  } = useLikedDesigners({
    category: designerCategoryParam,
    enabled: activeTab === 'designer',
  });

  // 찜한 공고 목록 조회
  const {
    data: recruitmentData,
    isLoading: isRecruitmentLoading,
    hasNextPage: hasRecruitmentNextPage,
    isFetchingNextPage: isFetchingRecruitmentNextPage,
    fetchNextPage: fetchRecruitmentNextPage,
  } = useLikedRecruitments({
    category: recruitmentCategoryParam,
    enabled: activeTab === 'recruitment',
  });

  // 디자이너 데이터 가공
  const designers = useMemo(() => {
    return designerData?.pages.flatMap((page) => page.result.items) ?? [];
  }, [designerData?.pages]);

  // 공고 데이터 가공
  const recruitments = useMemo(() => {
    return recruitmentData?.pages.flatMap((page) => page.result.items) ?? [];
  }, [recruitmentData?.pages]);

  // 현재 탭에 따른 무한스크롤 설정
  const hasNextPage = activeTab === 'designer' ? hasDesignerNextPage : hasRecruitmentNextPage;
  const isFetchingNextPage = activeTab === 'designer' ? isFetchingDesignerNextPage : isFetchingRecruitmentNextPage;
  const fetchNextPage = activeTab === 'designer' ? fetchDesignerNextPage : fetchRecruitmentNextPage;

  // 무한스크롤
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.push('/mypage')}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="size-6" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">찜</h1>
        {/* 균형을 위한 빈 공간 */}
        <div className="size-6" />
      </header>

      {/* 탭 */}
      <LikesPageTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col pt-4">
        {/* 카테고리 필터 */}
        <div className="px-4">
          <LikesCategoryChips
            selectedCategory={currentCategory}
            onCategoryChange={setCurrentCategory}
          />
        </div>

        {/* 목록 영역 */}
        <div className="mt-[17px] flex-1">
          {activeTab === 'designer' ? (
            <div className="px-4">
              <LikedDesignerList
                designers={designers}
                isLoading={isDesignerLoading}
                isFetchingNext={isFetchingDesignerNextPage}
              />
            </div>
          ) : (
            <LikedRecruitmentGrid
              recruitments={recruitments}
              isLoading={isRecruitmentLoading}
              isFetchingNext={isFetchingRecruitmentNextPage}
            />
          )}
        </div>

        {/* 무한스크롤 감지 영역 */}
        <div ref={loadMoreRef} className="h-1" />
      </div>
    </div>
  );
}
