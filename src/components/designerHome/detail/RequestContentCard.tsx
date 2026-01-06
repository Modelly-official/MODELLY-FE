'use client';

interface RequestContentCardProps {
  comment: string | null;
}

export function RequestContentCard({ comment }: RequestContentCardProps) {
  if (!comment) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-[12px] bg-white p-5">
      {/* 라벨 */}
      <span className="text-body-2-medium text-gray-700">작성 내용</span>

      {/* 작성 내용 텍스트 */}
      <p className="text-body-1-medium text-gray-900">{comment}</p>
    </div>
  );
}
