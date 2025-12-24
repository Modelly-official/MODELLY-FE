import { Skeleton } from '@/src/components/common/Skeleton';

export default function PostInfoSkeleton() {
  return (
    <>
      {/* 제목 및 찜하기 */}
      <div className="flex items-start justify-between gap-4 px-4 pt-4">
        <Skeleton className="h-7 flex-1" />
        <Skeleton variant="circular" className="size-6 shrink-0" />
      </div>

      {/* 디자이너 정보 */}
      <div className="flex flex-col gap-1 px-4 pt-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </>
  );
}
