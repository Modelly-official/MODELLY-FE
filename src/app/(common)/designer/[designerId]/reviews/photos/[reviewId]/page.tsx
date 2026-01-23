'use client';

import { useParams } from 'next/navigation';
import DesignerReviewPhotoDetailView from '@/src/components/designerProfile/review/DesignerReviewPhotoDetailView';

export default function DesignerReviewPhotoDetailPage() {
  const { designerId, reviewId } = useParams<{ designerId: string; reviewId: string }>();
  const numericDesignerId = Number(designerId);
  const numericReviewId = Number(reviewId);

  return (
    <DesignerReviewPhotoDetailView
      designerId={Number.isNaN(numericDesignerId) ? 0 : numericDesignerId}
      reviewId={Number.isNaN(numericReviewId) ? 0 : numericReviewId}
    />
  );
}
