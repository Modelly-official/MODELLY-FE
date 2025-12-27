'use client';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

// 서브카테고리 코드를 한글로 변환
const CATEGORY_LABELS: Record<string, string> = {
  // 메인 카테고리
  HAIR: '헤어',
  NAIL: '네일',
  TATTOO: '타투',
  EYELASH: '속눈썹',
  // 헤어 서브카테고리
  HAIR_CUT: '커트',
  HAIR_PERM: '펌',
  HAIR_COLORING: '염색',
  HAIR_MAGIC: '매직',
  // 네일 서브카테고리
  ONE_COLOR: '원컬러',
  ART: '아트',
  PEDICURE: '페디큐어',
  // 속눈썹 서브카테고리
  EYELASH_PERM: '래쉬펌',
  EYELASH_EXTENSION: '익스텐션',
  // 타투 서브카테고리
  LIP_TATTOO: '입술',
  EYEBROW_TATTOO: '눈썹',
  NORMAL_TATTOO: '타투',
};

/**
 * 카테고리 코드를 한글 라벨로 변환
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}

/**
 * 카테고리 배지 컴포넌트
 */
export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const label = getCategoryLabel(category);

  return (
    <span
      className={`text-caption-1-medium rounded bg-purple-200 px-2 py-[2px] text-purple-700 ${className}`}
    >
      {label}
    </span>
  );
}
