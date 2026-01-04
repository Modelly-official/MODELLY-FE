'use client';

import CategoryBadge from '@/src/components/common/CategoryBadge';

interface RequestContentCardProps {
  category: string;
  subCategories: string[];
}

export function RequestContentCard({ category, subCategories }: RequestContentCardProps) {
  const allCategories = [category, ...subCategories];

  return (
    <div className="flex flex-col gap-2 rounded-[12px] bg-white p-5">
      {/* 라벨 */}
      <span className="text-body-2-medium text-gray-700">신청 내용</span>

      {/* 카테고리 배지 */}
      <div className="flex flex-wrap items-center gap-2">
        {allCategories.map((cat) => (
          <CategoryBadge key={cat} label={cat} />
        ))}
      </div>
    </div>
  );
}
