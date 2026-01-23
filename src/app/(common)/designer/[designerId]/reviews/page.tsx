'use client';

import { useParams } from 'next/navigation';
import DesignerReviewAllView from '@/src/components/designerProfile/review/DesignerReviewAllView';

export default function DesignerReviewsPage() {
  const { designerId } = useParams<{ designerId: string }>();
  const numericDesignerId = Number(designerId);

  return <DesignerReviewAllView designerId={Number.isNaN(numericDesignerId) ? 0 : numericDesignerId} />;
}
