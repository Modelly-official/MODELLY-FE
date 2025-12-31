'use client';

import type { RecruitmentListItem } from '@/src/types';
import { RecruitmentCard, RecruitmentCardSkeleton } from '@/src/components/explore';

interface RecruitmentGridProps {
  recruitments: RecruitmentListItem[];
  isLoading: boolean;
  isFetchingNext: boolean;
  onLikeToggle: (recruitmentId: number) => void;
}

/**
 * 공고 카드 그리드 렌더링 컴포넌트
 */
export default function RecruitmentGrid({ recruitments, isLoading, isFetchingNext, onLikeToggle }: RecruitmentGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-6">
      {isLoading
        ? [0, 1, 2, 3, 4, 5].map((index) => <RecruitmentCardSkeleton key={index} isLeftColumn={index % 2 === 0} />)
        : recruitments.map((recruitment, index) => (
            <RecruitmentCard
              key={recruitment.recruitmentId}
              recruitment={recruitment}
              isLeftColumn={index % 2 === 0}
              onLikeToggle={() => onLikeToggle(recruitment.recruitmentId)}
            />
          ))}
      {isFetchingNext &&
        [0, 1].map((index) => <RecruitmentCardSkeleton key={`loading-${index}`} isLeftColumn={index % 2 === 0} />)}
    </div>
  );
}
