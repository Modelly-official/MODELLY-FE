'use client';

import type { LikesCategoryFilter } from '@/src/types';

interface LikesCategoryChipsProps {
  selectedCategory: LikesCategoryFilter;
  onCategoryChange: (category: LikesCategoryFilter) => void;
}

const LIKES_CATEGORY_FILTERS: { code: LikesCategoryFilter; name: string }[] = [
  { code: 'ALL', name: '전체' },
  { code: 'HAIR', name: '헤어' },
  { code: 'NAIL', name: '네일' },
  { code: 'TATTOO', name: '타투' },
  { code: 'EYELASH', name: '속눈썹' },
];

export default function LikesCategoryChips({
  selectedCategory,
  onCategoryChange,
}: LikesCategoryChipsProps) {
  return (
    <div className="scrollbar-hide flex gap-1.5 overflow-x-auto">
      {LIKES_CATEGORY_FILTERS.map((category) => {
        const isActive = selectedCategory === category.code;
        return (
          <button
            key={category.code}
            type="button"
            onClick={() => onCategoryChange(category.code)}
            className={`flex shrink-0 cursor-pointer items-center justify-center rounded-[99px] px-3.5 py-1.5 transition-colors ${
              isActive
                ? 'text-body-2-medium bg-gray-900 text-white'
                : 'text-body-2-regular border border-gray-400 text-gray-700'
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
