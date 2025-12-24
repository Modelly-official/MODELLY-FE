'use client';

import { useState } from 'react';
import {
  ExploreHeader,
  CategoryTabs,
  SearchBar,
  SubCategoryChips,
  SortDropdown,
  RecruitmentCard,
  DesignerCard,
} from '@/src/components/explore';
import { CATEGORIES, HAIR_SUB_CATEGORIES, SORT_OPTIONS } from '@/src/constants/explore';
import {
  mockRecruitmentItems,
  mockDesignerItems,
  mockRecruitmentListResponse,
  mockDesignerListResponse,
} from '@/src/mocks/explore';

export default function ExplorePage() {
  // 상태 관리
  const [view, setView] = useState<'designer' | 'recruitment'>('recruitment');
  const [selectedCategory, setSelectedCategory] = useState('HAIR');
  const [selectedSubCategory, setSelectedSubCategory] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('MOST_REVIEWS');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Mock 데이터 사용
  const recruitments = mockRecruitmentItems;
  const designers = mockDesignerItems;
  const totalRecruitments = mockRecruitmentListResponse.items.length;
  const totalDesigners = mockDesignerListResponse.items.length;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <ExploreHeader view={view} onViewChange={setView} />

      {/* 카테고리 탭 */}
      <CategoryTabs
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* 검색 및 필터 영역 */}
      <div className="flex flex-col gap-3 px-4 py-4">
        {/* 검색바 */}
        <SearchBar value={searchKeyword} onChange={setSearchKeyword} />

        {/* 공고 탐색일 때만 서브 카테고리 칩 표시 */}
        {view === 'recruitment' && (
          <SubCategoryChips
            subCategories={HAIR_SUB_CATEGORIES}
            selectedSubCategory={selectedSubCategory}
            onSubCategoryChange={setSelectedSubCategory}
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
          <SortDropdown sortOptions={SORT_OPTIONS} selectedSort={selectedSort} onSortChange={setSelectedSort} />
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 pb-6">
        {view === 'recruitment' ? (
          /* 공고 그리드 (2열) */
          <div className="grid grid-cols-2 gap-x-2 gap-y-6">
            {recruitments.map((recruitment, index) => (
              <RecruitmentCard
                key={recruitment.recruitmentId}
                recruitment={recruitment}
                isLeftColumn={index % 2 === 0}
              />
            ))}
          </div>
        ) : (
          /* 디자이너 리스트 */
          <div className="flex flex-col gap-6 px-4">
            {designers.map((designer) => (
              <DesignerCard key={designer.designerId} designer={designer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
