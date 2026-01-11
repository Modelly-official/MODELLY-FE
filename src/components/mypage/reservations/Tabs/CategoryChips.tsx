'use client';

import type { ReservationCategoryFilter } from '@/src/types';
import { RESERVATION_CATEGORY_FILTERS } from '@/src/constants';

interface CategoryChipsProps {
  selectedCategory: ReservationCategoryFilter;
  onCategoryChange: (category: ReservationCategoryFilter) => void;
}

export default function CategoryChips({
  selectedCategory,
  onCategoryChange,
}: CategoryChipsProps) {
  return (
    <div className="scrollbar-hide flex gap-1.5 overflow-x-auto">
      {RESERVATION_CATEGORY_FILTERS.map((category) => {
        const isActive = selectedCategory === category.code;
        return (
          <button
            key={category.code}
            type="button"
            onClick={() => onCategoryChange(category.code)}
            className={`flex shrink-0 cursor-pointer items-center justify-center rounded-[99px] px-3.5 py-1.5 transition-colors ${
              isActive
                ? 'text-body-2-medium bg-gray-900 text-white'
                : 'text-body-2-regular border border-gray-200 bg-white text-gray-800'
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
