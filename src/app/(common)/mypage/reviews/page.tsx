'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getUserRole } from '@/src/stores/auth/useAuthStore';
import ModelReviewsPage from './_components/ModelReviewsPage';
import DesignerReviewsPage from './_components/DesignerReviewsPage';

export default function MyReviewsPage() {
  const router = useRouter();
  const userRole = getUserRole();

  useEffect(() => {
    if (userRole === null) {
      router.replace('/login');
    }
  }, [userRole, router]);

  // 비인증 사용자 - 리다이렉트 중 로딩 표시
  if (userRole === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (userRole === 'designer') {
    return <DesignerReviewsPage />;
  }

  return <ModelReviewsPage />;
}
