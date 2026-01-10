'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import {
  LikesPageTabs,
  LikesCategoryChips,
  LikedDesignerList,
} from '@/src/components/mypage/likes';
import type { LikesTabType } from '@/src/components/mypage/likes';
import type { LikesCategoryFilter, Category } from '@/src/types';
import { useLikedDesigners } from '@/src/hooks/queries/likes';
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

  // 디자이너 데이터 가공
  const designers = useMemo(() => {
    return designerData?.pages.flatMap((page) => page.result.items) ?? [];
  }, [designerData?.pages]);

  // 무한스크롤
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: activeTab === 'designer' ? hasDesignerNextPage : false,
    isFetchingNextPage: activeTab === 'designer' ? isFetchingDesignerNextPage : false,
    fetchNextPage: activeTab === 'designer' ? fetchDesignerNextPage : () => {},
  });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="text-black" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">찜</h1>
        {/* 균형을 위한 빈 공간 */}
        <div className="size-6" />
      </header>

      {/* 탭 */}
      <LikesPageTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col px-4 pt-4">
        {/* 카테고리 필터 */}
        <LikesCategoryChips
          selectedCategory={currentCategory}
          onCategoryChange={setCurrentCategory}
        />

        {/* 목록 영역 */}
        <div className="mt-[17px] flex-1">
          {activeTab === 'designer' ? (
            <LikedDesignerList
              designers={designers}
              isLoading={isDesignerLoading}
              isFetchingNext={isFetchingDesignerNextPage}
            />
          ) : (
            <div className="text-body-2-medium text-gray-600">
              공고 목록 (다음 단계에서 구현)
            </div>
          )}
        </div>

        {/* 무한스크롤 감지 영역 */}
        <div ref={loadMoreRef} className="h-1" />
      </div>
    </div>
  );
}
