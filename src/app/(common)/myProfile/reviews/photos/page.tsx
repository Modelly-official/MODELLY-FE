'use client';

import DesignerReviewPhotoGalleryView from '@/src/components/designerProfile/review/DesignerReviewPhotoGalleryView';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import { useMyDesignerProfile } from '@/src/hooks/queries/profile';

export default function MyProfileReviewPhotosPage() {
  const { authReady, isLoggedIn } = useAuthReady();
  const { data, isLoading, isError } = useMyDesignerProfile({
    enabled: authReady && isLoggedIn,
  });

  if (!authReady || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-2-medium text-gray-500">사진을 불러오는 중입니다.</p>
      </div>
    );
  }

  const designerId = data?.result?.profile.designerId;

  if (isError || !designerId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-2-medium text-gray-600">사진을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <DesignerReviewPhotoGalleryView designerId={designerId} mode="owner" />;
}
