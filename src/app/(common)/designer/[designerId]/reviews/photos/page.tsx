'use client';

import { use } from 'react';
import DesignerReviewPhotoGalleryView from '@/src/components/designerProfile/review/DesignerReviewPhotoGalleryView';

interface PageProps {
  params: Promise<{ designerId: string }>;
}

export default function DesignerReviewPhotosPage({ params }: PageProps) {
  const { designerId } = use(params);
  const numericDesignerId = Number(designerId);

  return (
    <DesignerReviewPhotoGalleryView
      designerId={Number.isNaN(numericDesignerId) ? 0 : numericDesignerId}
    />
  );
}
