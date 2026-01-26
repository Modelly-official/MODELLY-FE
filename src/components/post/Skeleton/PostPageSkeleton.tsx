import { Skeleton } from '@/src/components/common/Skeleton';
import { FixedBottomContainer } from '@/src/components/common/FixedBottomContainer';
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
      <FixedBottomContainer hasBorder>
        <div className="flex gap-2">
          <Skeleton className="h-[56px] flex-1 rounded-full" />
          <Skeleton className="h-[56px] flex-1 rounded-full" />
        </div>
      </FixedBottomContainer>
    </div>
  );
}
