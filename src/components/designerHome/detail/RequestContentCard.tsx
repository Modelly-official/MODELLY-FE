'use client';

interface RequestContentCardProps {
  categories: string[];
}

export function RequestContentCard({ categories }: RequestContentCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-[12px] bg-white p-5">
      {/* 라벨 */}
      <span className="text-body-2-medium text-gray-700">신청 내용</span>

      {/* 카테고리 배지 */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((category, index) => (
          <span
            key={category}
            className={`rounded-lg px-3 py-2 text-body-2-medium text-gray-900 ${
              index === 0 ? 'border border-gray-400 bg-white' : 'bg-gray-200'
            }`}
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  );
}
