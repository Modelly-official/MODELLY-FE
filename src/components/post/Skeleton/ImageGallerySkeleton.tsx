import { Skeleton } from '@/src/components/common/Skeleton';

export default function ImageGallerySkeleton() {
  return (
    <div className="relative h-[375px] w-full bg-gray-200">
      {/* 뒤로가기 버튼 */}
      <div className="absolute top-4 left-4 z-10">
        <Skeleton variant="circular" className="size-10" />
      </div>

      {/* 이미지 카운터 */}
      <div className="absolute right-4 bottom-4">
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
    </div>
  );
}
