'use client';

import { getCategoryLabel } from '@/src/constants/explore';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

// getCategoryLabel은 constants/explore.ts에서 re-export
export { getCategoryLabel } from '@/src/constants/explore';

/**
 * 카테고리 배지 컴포넌트
 */
export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const label = getCategoryLabel(category);

  return (
    <span className={`text-caption-1-medium rounded bg-purple-200 px-2 py-[2px] text-purple-700 ${className}`}>
      {label}
    </span>
  );
}
