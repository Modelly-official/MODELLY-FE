'use client';

import { use } from 'react';
import DesignerReviewAllView from '@/src/components/designerProfile/review/DesignerReviewAllView';

interface PageProps {
  params: Promise<{ designerId: string }>;
}

export default function DesignerReviewsPage({ params }: PageProps) {
  const { designerId } = use(params);
  const numericDesignerId = Number(designerId);

  return <DesignerReviewAllView designerId={Number.isNaN(numericDesignerId) ? 0 : numericDesignerId} />;
}
