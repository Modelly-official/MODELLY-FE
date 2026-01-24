'use client';

import { useState, useEffect } from 'react';
import { getUserRole } from '@/src/stores/auth/useAuthStore';
import { DesignerHomeContent } from '@/src/components/designerHome';
import { ModelHomeContent } from '@/src/components/modelHome';

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
