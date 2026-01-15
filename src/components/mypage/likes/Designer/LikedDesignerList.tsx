'use client';

import type { LikedDesignerItem } from '@/src/types';
import LikedDesignerCard from './LikedDesignerCard';
import LikedDesignerCardSkeleton from './LikedDesignerCardSkeleton';

interface LikedDesignerListProps {
  designers: LikedDesignerItem[];
  isLoading: boolean;
  isFetchingNext: boolean;
}

export default function LikedDesignerList({
  designers,
  isLoading,
  isFetchingNext,
}: LikedDesignerListProps) {
  // 초기 로딩 상태
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {[0, 1, 2, 3].map((index) => (
          <LikedDesignerCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // 빈 목록
  if (designers.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-body-2-medium text-gray-600">찜한 디자이너가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {designers.map((designer) => (
        <LikedDesignerCard key={designer.designerLikeId} designer={designer} />
      ))}
      {isFetchingNext &&
        [0, 1].map((index) => <LikedDesignerCardSkeleton key={`loading-${index}`} />)}
    </div>
  );
}
