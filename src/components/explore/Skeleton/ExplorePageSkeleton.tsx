import { Skeleton } from '@/src/components/common/Skeleton';
import RecruitmentCardSkeleton from './RecruitmentCardSkeleton';

export default function ExplorePageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-6 border-b border-gray-200 px-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-12" />
        ))}
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="flex flex-col gap-3 px-4 py-4">
        {/* 검색바 */}
        <Skeleton className="h-12 w-full rounded-lg" />

        {/* 서브 카테고리 칩 */}
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-14 shrink-0 rounded-full" />
          ))}
        </div>

        {/* 총 개수 및 정렬 */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>

      {/* 콘텐츠 영역 - 공고 그리드 (2열) */}
      <div className="flex-1 pb-6">
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <RecruitmentCardSkeleton key={index} isLeftColumn={index % 2 === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
