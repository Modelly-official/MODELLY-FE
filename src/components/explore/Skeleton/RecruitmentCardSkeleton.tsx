import { Skeleton } from '@/src/components/common/Skeleton';

interface RecruitmentCardSkeletonProps {
  isLeftColumn?: boolean;
}

export default function RecruitmentCardSkeleton({ isLeftColumn = false }: RecruitmentCardSkeletonProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {/* 이미지 */}
      <Skeleton className="h-[210px] w-full rounded-none" />

      {/* 정보 */}
      <div className={`flex flex-col gap-2 ${isLeftColumn ? 'pr-[9px] pl-4' : 'pr-4 pl-[10px]'}`}>
        <div className="flex flex-col gap-1">
          {/* 제목 */}
          <Skeleton className="h-5 w-3/4" />

          {/* 디자이너 정보 */}
          <div className="flex flex-col gap-0.5">
            <Skeleton className="h-4 w-2/3" />

            {/* 위치 */}
            <Skeleton className="h-4 w-1/2" />

            {/* 별점 및 거리 */}
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* 서비스 태그 */}
        <div className="flex gap-1">
          <Skeleton className="h-6 w-12 rounded" />
          <Skeleton className="h-6 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}
