'use client';

interface RecruitmentEmptyProps {
  month: number;
}

export default function RecruitmentEmpty({ month }: RecruitmentEmptyProps) {
  return (
    <div className="flex items-center justify-center pt-[210px]">
      <p className="text-head-4-medium text-gray-700">작성한 모집글이 없어요</p>
    </div>
  );
}
