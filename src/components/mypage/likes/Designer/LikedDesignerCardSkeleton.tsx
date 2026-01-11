import { Skeleton } from '@/src/components/common/Skeleton';

export default function LikedDesignerCardSkeleton() {
  return (
    <div className="flex items-center justify-between">
      {/* 왼쪽: 디자이너 정보 */}
      <div className="flex items-center gap-3">
        {/* 프로필 이미지 */}
        <Skeleton variant="circular" className="size-[78px] shrink-0" />

        {/* 정보 */}
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-28" />

          <div className="flex flex-col gap-0.5">
            {/* 위치 및 샵 이름 */}
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>

      {/* 오른쪽: 찜하기 버튼 */}
      <Skeleton variant="circular" className="size-5 shrink-0" />
    </div>
  );
}
