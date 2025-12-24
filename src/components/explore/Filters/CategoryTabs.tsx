'use client';

import type { Category } from '@/src/constants/explore';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({ categories, selectedCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-0.5 border-b border-gray-300 px-4">
      {categories.map((category) => {
        const isActive = selectedCategory === category.code;
        return (
          <button
            key={category.code}
            type="button"
            onClick={() => onCategoryChange(category.code)}
            className={`text-body-1-medium flex-1 cursor-pointer px-3 py-2 transition-colors ${
              isActive ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-600'
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
