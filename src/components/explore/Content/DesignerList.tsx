'use client';

import type { DesignerListItem } from '@/src/types';
import { DesignerCard, DesignerCardSkeleton } from '@/src/components/explore';

interface DesignerListProps {
  designers: DesignerListItem[];
  isLoading: boolean;
  isFetchingNext: boolean;
  onLikeToggle: (designerId: number) => void;
}

/**
 * 디자이너 카드 리스트 렌더링 컴포넌트
 */
export default function DesignerList({ designers, isLoading, isFetchingNext, onLikeToggle }: DesignerListProps) {
  return (
    <div className="flex flex-col gap-6 px-4">
      {isLoading
        ? [0, 1, 2, 3].map((index) => <DesignerCardSkeleton key={index} />)
        : designers.map((designer) => (
            <DesignerCard
              key={designer.designerId}
              designer={designer}
              onLikeToggle={() => onLikeToggle(designer.designerId)}
            />
          ))}
      {isFetchingNext && [0, 1].map((index) => <DesignerCardSkeleton key={`loading-${index}`} />)}
    </div>
  );
}
