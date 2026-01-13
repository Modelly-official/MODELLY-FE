'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import ModelReviewsPage from './_components/ModelReviewsPage';
import DesignerReviewsPage from './_components/DesignerReviewsPage';

export default function MyReviewsPage() {
  const router = useRouter();
  const { role, isLoggedIn, authReady } = useAuthReady();

  useEffect(() => {
    if (authReady && !isLoggedIn) {
      router.replace('/login');
    }
  }, [authReady, isLoggedIn, router]);

  // 클라이언트 준비 전 또는 비인증 사용자 - 로딩 표시
  if (!authReady || !isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (role === 'designer') {
    return <DesignerReviewsPage />;
  }

  return <ModelReviewsPage />;
}
