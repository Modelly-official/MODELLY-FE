'use client';

import { use } from 'react';
import DesignerReviewPhotoDetailView from '@/src/components/designerProfile/review/DesignerReviewPhotoDetailView';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import { useMyDesignerProfile } from '@/src/hooks/queries/profile';

interface PageProps {
  params: Promise<{ reviewId: string }>;
}

export default function MyProfileReviewPhotoDetailPage({ params }: PageProps) {
  const { reviewId } = use(params);
  const numericReviewId = Number(reviewId);
  const { authReady, isLoggedIn } = useAuthReady();
  const { data, isLoading, isError } = useMyDesignerProfile({
    enabled: authReady && isLoggedIn,
  });

  if (!authReady || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-2-medium text-gray-500">리뷰를 불러오는 중입니다.</p>
      </div>
    );
  }

  const designerId = data?.result?.profile.designerId;

  if (isError || !designerId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-2-medium text-gray-600">리뷰 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <DesignerReviewPhotoDetailView
      designerId={designerId}
      reviewId={Number.isNaN(numericReviewId) ? 0 : numericReviewId}
      mode="owner"
    />
  );
}
