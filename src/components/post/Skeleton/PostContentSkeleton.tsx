import { Skeleton } from '@/src/components/common/Skeleton';

export default function PostContentSkeleton() {
  return (
    <>
      {/* 탭 */}
      <div className="mt-6 flex border-b border-gray-200">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 flex-1" />
      </div>

      {/* 탭 내용 */}
      <div className="flex flex-col gap-2 bg-gray-100 px-4 py-4">
        {/* 시술 내용 */}
        <div className="flex flex-col gap-2 rounded-lg bg-white p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <div className="flex gap-1">
              <Skeleton className="h-6 w-12 rounded" />
              <Skeleton className="h-6 w-12 rounded" />
            </div>
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>

        {/* 시술 가능한 날짜 */}
        <div className="flex flex-col gap-2 rounded-lg bg-white p-4">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[60px] w-[74px] shrink-0 rounded-lg" />
            ))}
          </div>
        </div>

        {/* 모집 목적 */}
        <div className="flex flex-col gap-2 rounded-lg bg-white p-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>

        {/* 유의사항 */}
        <div className="flex flex-col gap-2 rounded-lg bg-white p-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </>
  );
}
