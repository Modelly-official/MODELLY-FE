'use client';

import { useParams } from 'next/navigation';
import DesignerReviewPhotoGalleryView from '@/src/components/designerProfile/review/DesignerReviewPhotoGalleryView';

export default function DesignerReviewPhotosPage() {
  const { designerId } = useParams<{ designerId: string }>();
  const numericDesignerId = Number(designerId);

  return (
    <DesignerReviewPhotoGalleryView
      designerId={Number.isNaN(numericDesignerId) ? 0 : numericDesignerId}
    />
  );
}
