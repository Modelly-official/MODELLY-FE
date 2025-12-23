'use client';

import type { Category } from '@/src/types';

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
            className={`flex-1 px-3 py-2 text-body-1-medium transition-colors ${
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

