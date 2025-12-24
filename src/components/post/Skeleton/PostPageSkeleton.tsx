import { Skeleton } from '@/src/components/common/Skeleton';
import ImageGallerySkeleton from './ImageGallerySkeleton';
import PostInfoSkeleton from './PostInfoSkeleton';
import PostContentSkeleton from './PostContentSkeleton';

export default function PostPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 이미지 갤러리 */}
      <ImageGallerySkeleton />

      {/* 제목 및 디자이너 정보 */}
      <PostInfoSkeleton />

      {/* 탭 및 내용 */}
      <PostContentSkeleton />

      {/* 하단 버튼 영역 */}
      <div className="h-[88px]" />
      <div className="fixed right-0 bottom-0 left-0 flex gap-2 border-t border-gray-200 bg-white px-4 py-3">
        <Skeleton className="h-12 flex-1 rounded-full" />
        <Skeleton className="h-12 flex-1 rounded-full" />
      </div>
    </div>
  );
}
