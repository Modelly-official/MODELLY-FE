'use client';

import type { SubCategory } from '@/src/constants/explore';

interface SubCategoryChipsProps {
  subCategories: SubCategory[];
  selectedSubCategory: string;
  onSubCategoryChange: (subCategory: string) => void;
}

export default function SubCategoryChips({
  subCategories,
  selectedSubCategory,
  onSubCategoryChange,
}: SubCategoryChipsProps) {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto">
      {subCategories.map((subCategory) => {
        const isActive = selectedSubCategory === subCategory.code;
        return (
          <button
            key={subCategory.code}
            type="button"
            onClick={() => onSubCategoryChange(subCategory.code)}
            className={`text-body-2-medium shrink-0 cursor-pointer rounded-[99px] px-3 py-1 transition-colors ${
              isActive ? 'bg-gray-900 text-white' : 'border border-gray-300 text-gray-600'
            }`}
          >
            {subCategory.name}
          </button>
        );
      })}
    </div>
  );
}
