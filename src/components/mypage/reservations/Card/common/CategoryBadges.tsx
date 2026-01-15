'use client';

import { subCategoryCodeToName, categoryCodeToName } from '@/src/utils/myRecruitment';

type StatusBadgeType = 'pending' | 'completed' | null;

interface CategoryBadgesProps {
  category: string;
  subCategories: string[];
  statusBadge?: StatusBadgeType;
}

const STATUS_BADGE_CONFIG: Record<NonNullable<StatusBadgeType>, string> = {
  pending: '확정 대기중',
  completed: '완료',
};

export default function CategoryBadges({
  category,
  subCategories,
  statusBadge = null,
}: CategoryBadgesProps) {
  const categoryLabel =
    categoryCodeToName(category as 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH') ?? category;

  const subCategoryLabels = subCategories.map((code) =>
    subCategoryCodeToName(category, code)
  );

  return (
    <div className="flex items-center gap-1">
      {/* 메인 카테고리 뱃지 */}
      <span className="text-caption-1-medium rounded-lg bg-purple-600 px-2 py-1 text-white">
        {categoryLabel}
      </span>

      {/* 서브카테고리 뱃지 */}
      {subCategoryLabels.map((label) => (
        <span
          key={label}
          className="text-caption-1-medium rounded-lg bg-purple-200 px-2 py-1 text-purple-700"
        >
          {label}
        </span>
      ))}

      {/* 상태 뱃지 */}
      {statusBadge && (
        <span className="text-caption-1-medium rounded-lg border border-gray-400 px-2 py-1 text-gray-800">
          {STATUS_BADGE_CONFIG[statusBadge]}
        </span>
      )}
    </div>
  );
}
