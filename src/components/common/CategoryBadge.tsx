'use client';

import { getCategoryLabel } from '@/src/constants/explore';

interface CategoryBadgeProps {
  /** 카테고리 코드 (getCategoryLabel로 변환) */
  category?: string;
  /** 직접 표시할 라벨 (변환 없이 그대로 표시) */
  label?: string;
  /** 배지 스타일 변형 */
  variant?: 'default' | 'filled';
  className?: string;
}

// getCategoryLabel은 constants/explore.ts에서 re-export
export { getCategoryLabel } from '@/src/constants/explore';

/**
 * 카테고리 배지 컴포넌트
 * - category: 코드를 라벨로 변환하여 표시
 * - label: 문자열을 그대로 표시
 * - variant: default(연한 배경) / filled(진한 배경)
 */
export default function CategoryBadge({
  category,
  label,
  variant = 'default',
  className = '',
}: CategoryBadgeProps) {
  const displayLabel = label ?? (category ? getCategoryLabel(category) : '');

  const variantStyles =
    variant === 'filled'
      ? 'bg-purple-600 text-white'
      : 'bg-purple-200 text-purple-700';

  return (
    <span className={`text-caption-1-medium rounded-lg px-2 py-1 ${variantStyles} ${className}`}>
      {displayLabel}
    </span>
  );
}
