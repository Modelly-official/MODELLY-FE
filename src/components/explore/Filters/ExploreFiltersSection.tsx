'use client';

import { CATEGORIES, SUB_CATEGORIES_BY_CATEGORY, SORT_OPTIONS } from '@/src/constants/explore';
import { CategoryTabs, SearchBar, SubCategoryChips } from '@/src/components/explore';
import Dropdown from '@/src/components/common/Dropdown/Dropdown';
import type { Category, SubCategory, SortOption } from '@/src/types';
import type { ExploreView } from '@/src/hooks/custom/explore';

interface ExploreFiltersSectionProps {
  view: ExploreView;
  category: Category;
  subCategory: SubCategory | 'ALL';
  sort: SortOption;
  keyword: string;
  totalCount: number;
  onCategoryChange: (category: Category) => void;
  onSubCategoryChange: (subCategory: SubCategory | 'ALL') => void;
  onSortChange: (sort: SortOption) => void;
  onKeywordChange: (keyword: string) => void;
}

/**
 * Explore 페이지의 필터 영역을 담당하는 컴포넌트
 * 카테고리 탭, 검색바, 서브 카테고리, 정렬 옵션을 포함
 */
export default function ExploreFiltersSection({
  view,
  category,
  subCategory,
  sort,
  keyword,
  totalCount,
  onCategoryChange,
  onSubCategoryChange,
  onSortChange,
  onKeywordChange,
}: ExploreFiltersSectionProps) {
  return (
    <>
      {/* 카테고리 탭 */}
      <CategoryTabs
        categories={CATEGORIES}
        selectedCategory={category}
        onCategoryChange={(cat) => onCategoryChange(cat as Category)}
      />

      {/* 검색 및 필터 영역 */}
      <div className="flex flex-col gap-3 px-4 py-4">
        {/* 검색바 */}
        <SearchBar value={keyword} onChange={onKeywordChange} />

        {/* 공고 탐색일 때만 서브 카테고리 칩 표시 */}
        {view === 'recruitment' && (
          <SubCategoryChips
            subCategories={SUB_CATEGORIES_BY_CATEGORY[category]}
            selectedSubCategory={subCategory}
            onSubCategoryChange={(sub) => onSubCategoryChange(sub as SubCategory | 'ALL')}
          />
        )}

        {/* 총 개수 및 정렬 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-body-2-medium text-black">전체</span>
            <span className="text-body-2-semibold text-gray-600">{totalCount}</span>
          </div>
          <Dropdown
            variant="inline"
            ariaLabel="정렬 방식 선택"
            options={SORT_OPTIONS.map((opt) => ({ value: opt.code, label: opt.name }))}
            value={sort}
            onChange={(value) => onSortChange(value as SortOption)}
          />
        </div>
      </div>
    </>
  );
}
