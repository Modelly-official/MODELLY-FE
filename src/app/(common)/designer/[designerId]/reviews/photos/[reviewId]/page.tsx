'use client';

import { use } from 'react';
import DesignerReviewPhotoDetailView from '@/src/components/designerProfile/review/DesignerReviewPhotoDetailView';

interface PageProps {
  params: Promise<{ designerId: string; reviewId: string }>;
}

export default function DesignerReviewPhotoDetailPage({ params }: PageProps) {
  const { designerId, reviewId } = use(params);
  const numericDesignerId = Number(designerId);
  const numericReviewId = Number(reviewId);

  return (
    <DesignerReviewPhotoDetailView
      designerId={Number.isNaN(numericDesignerId) ? 0 : numericDesignerId}
      reviewId={Number.isNaN(numericReviewId) ? 0 : numericReviewId}
    />
  );
}
