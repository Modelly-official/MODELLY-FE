'use client';

import { useState, useEffect } from 'react';
import { getUserRole } from '@/src/stores/auth/useAuthStore';
import { BottomNav } from '@/src/components/common';
import { DesignerHomeContent } from '@/src/components/designerHome';

// ===== 모델/비로그인 홈 콘텐츠 =====
function ModelHomeContent() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 pb-[calc(60px+env(safe-area-inset-bottom)+16px)]">
        <h1 className="text-head-1-semibold text-gray-900">홈</h1>
        <p className="mt-2 text-body-2-medium text-gray-700">Home 페이지 (추후 구현 예정)</p>
      </div>
      <BottomNav />
    </>
  );
}

// ===== 메인 페이지 =====
export default function HomePage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 클라이언트 전용 상태 초기화 패턴
    setRole(getUserRole());
  }, []);

  // 역할에 따라 다른 콘텐츠 렌더링
  if (role === 'designer') {
    return <DesignerHomeContent />;
  }

  return <ModelHomeContent />;
}
