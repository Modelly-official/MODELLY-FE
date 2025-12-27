'use client';

import type { Category as CategoryType } from '@/src/types/recruitment';
import { CATEGORIES, SUB_CATEGORIES_BY_CATEGORY } from '@/src/constants/explore';
import type { SubCategory as SubCategoryType } from '@/src/types/recruitment';

interface CategorySelectorProps {
  selectedCategory: CategoryType | null;
  selectedSubCategories: SubCategoryType[];
  onCategoryChange: (category: CategoryType | null) => void;
  onSubCategoryToggle: (subCategory: SubCategoryType) => void;
}

export default function CategorySelector({
  selectedCategory,
  selectedSubCategories,
  onCategoryChange,
  onSubCategoryToggle,
}: CategorySelectorProps) {
  // 현재 카테고리에 해당하는 서브카테고리 목록 (ALL 제외)
  const subCategories = selectedCategory
    ? SUB_CATEGORIES_BY_CATEGORY[selectedCategory].filter((sub) => sub.code !== 'ALL')
    : [];

  return (
    <div className="flex flex-col gap-4">
      {/* 라벨 */}
      <div className="flex items-center gap-1">
        <span className="text-body-1-semibold text-gray-900">카테고리</span>
        <span className="text-head-3-semibold text-purple-500">*</span>
      </div>

      {/* 메인 카테고리 */}
      <div className="grid grid-cols-4 gap-2">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.code;
          return (
            <button
              key={category.code}
              type="button"
              onClick={() => onCategoryChange(isSelected ? null : category.code)}
              className={`flex h-[39px] cursor-pointer items-center justify-center rounded-[10px] text-[14px] leading-[1.5] tracking-[-0.28px] transition-colors ${
                isSelected
                  ? 'bg-purple-500 text-white'
                  : 'border border-gray-400 bg-white text-gray-900'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* 서브 카테고리 (메인 카테고리 선택 시 표시) */}
      {selectedCategory && subCategories.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-body-2-regular text-gray-600">상세 카테고리 (복수 선택 가능)</span>
          <div className="flex flex-wrap gap-2">
            {subCategories.map((subCategory) => {
              const isSelected = selectedSubCategories.includes(subCategory.code as SubCategoryType);
              return (
                <button
                  key={subCategory.code}
                  type="button"
                  onClick={() => onSubCategoryToggle(subCategory.code as SubCategoryType)}
                  className={`flex h-[33px] cursor-pointer items-center justify-center rounded-full px-4 text-[14px] leading-[1.5] tracking-[-0.28px] transition-colors ${
                    isSelected
                      ? 'bg-purple-500 text-white'
                      : 'border border-gray-400 bg-white text-gray-900'
                  }`}
                >
                  {subCategory.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
