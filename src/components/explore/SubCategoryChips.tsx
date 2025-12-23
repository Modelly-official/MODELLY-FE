'use client';

import type { SubCategory } from '@/src/types';

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
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {subCategories.map((subCategory) => {
        const isActive = selectedSubCategory === subCategory.code;
        return (
          <button
            key={subCategory.code}
            type="button"
            onClick={() => onSubCategoryChange(subCategory.code)}
            className={`shrink-0 rounded px-3 py-1 text-body-2-medium transition-colors ${
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

