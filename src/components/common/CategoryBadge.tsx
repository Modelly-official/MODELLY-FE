'use client';

import { getCategoryLabel } from '@/src/constants/explore';

interface CategoryBadgeProps {
  /** 카테고리 코드 (getCategoryLabel로 변환) */
  category?: string;
  /** 직접 표시할 라벨 (변환 없이 그대로 표시) */
  label?: string;
  className?: string;
}

// getCategoryLabel은 constants/explore.ts에서 re-export
export { getCategoryLabel } from '@/src/constants/explore';

/**
 * 카테고리 배지 컴포넌트
 * - category: 코드를 라벨로 변환하여 표시
 * - label: 문자열을 그대로 표시
 */
export default function CategoryBadge({ category, label, className = '' }: CategoryBadgeProps) {
  const displayLabel = label ?? (category ? getCategoryLabel(category) : '');

  return (
    <span className={`text-caption-1-medium rounded bg-purple-200 px-2 py-1 text-purple-700 ${className}`}>
      {displayLabel}
    </span>
  );
}
