'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import { LikesPageTabs, LikesCategoryChips } from '@/src/components/mypage/likes';
import type { LikesTabType } from '@/src/components/mypage/likes';
import type { LikesCategoryFilter } from '@/src/types';

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

        {/* 목록 영역 (다음 커밋에서 구현) */}
        <div className="mt-[17px] flex-1">
          {activeTab === 'designer' ? (
            <div className="text-body-2-medium text-gray-600">
              디자이너 목록 (다음 단계에서 구현)
            </div>
          ) : (
            <div className="text-body-2-medium text-gray-600">
              공고 목록 (다음 단계에서 구현)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
