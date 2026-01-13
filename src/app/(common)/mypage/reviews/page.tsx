'use client';

import { getUserRole } from '@/src/stores/auth/useAuthStore';
import ModelReviewsPage from './_components/ModelReviewsPage';
import DesignerReviewsPage from './_components/DesignerReviewsPage';

export default function MyReviewsPage() {
  const userRole = getUserRole();

  if (userRole === 'designer') {
    return <DesignerReviewsPage />;
  }

  return <ModelReviewsPage />;
}
