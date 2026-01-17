'use client';

import type { MyRecruitmentListItem } from '@/src/types/myRecruitment/recruitment';

import ClosedRecruitmentListItem from './ClosedRecruitmentListItem';
import RecruitmentEmpty from './RecruitmentEmpty';

interface ClosedRecruitmentListProps {
  recruitments: MyRecruitmentListItem[];
  totalCount: number;
  onClick?: (id: number) => void;
}

export default function ClosedRecruitmentList({
  recruitments,
  totalCount,
  onClick,
}: ClosedRecruitmentListProps) {
  if (recruitments.length === 0) {
    return <RecruitmentEmpty />;
  }

  return (
    <div className="flex flex-col gap-3 px-4 pt-3">
      {/* 전체 카운트 */}
      <div className="flex items-center gap-1">
        <span className="text-body-2-medium text-black">전체</span>
        <span className="text-body-2-semibold text-gray-600">{totalCount}</span>
      </div>

      {/* 리스트 */}
      <div className="flex flex-col gap-4">
        {recruitments.map((recruitment) => (
          <ClosedRecruitmentListItem
            key={recruitment.recruitmentId}
            recruitment={recruitment}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
}
