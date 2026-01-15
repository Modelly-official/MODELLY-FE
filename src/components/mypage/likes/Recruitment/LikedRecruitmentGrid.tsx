'use client';

import type { LikedRecruitmentItem } from '@/src/types';
import LikedRecruitmentCard from './LikedRecruitmentCard';
import LikedRecruitmentCardSkeleton from './LikedRecruitmentCardSkeleton';

interface LikedRecruitmentGridProps {
  recruitments: LikedRecruitmentItem[];
  isLoading: boolean;
  isFetchingNext: boolean;
}

export default function LikedRecruitmentGrid({
  recruitments,
  isLoading,
  isFetchingNext,
}: LikedRecruitmentGridProps) {
  // 초기 로딩 상태
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-2 gap-y-6">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <LikedRecruitmentCardSkeleton key={index} isLeftColumn={index % 2 === 0} />
        ))}
      </div>
    );
  }

  // 빈 목록
  if (recruitments.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-body-2-medium text-gray-600">찜한 공고가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-6">
      {recruitments.map((recruitment, index) => (
        <LikedRecruitmentCard
          key={recruitment.recruitmentLikeId}
          recruitment={recruitment}
          isLeftColumn={index % 2 === 0}
        />
      ))}
      {isFetchingNext &&
        [0, 1].map((index) => (
          <LikedRecruitmentCardSkeleton
            key={`loading-${index}`}
            isLeftColumn={(recruitments.length + index) % 2 === 0}
          />
        ))}
    </div>
  );
}
