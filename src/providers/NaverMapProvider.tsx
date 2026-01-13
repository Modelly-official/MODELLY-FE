'use client';

import { NavermapsProvider } from 'react-naver-maps';

interface NaverMapProviderProps {
  children: React.ReactNode;
}

export function NaverMapProvider({ children }: NaverMapProviderProps) {
  const ncpClientId = process.env.NEXT_PUBLIC_NCP_CLIENT_ID;

  if (!ncpClientId) {
    console.error('NEXT_PUBLIC_NCP_CLIENT_ID 환경변수가 설정되지 않았습니다.');
    return <>{children}</>;
  }

  return (
    <NavermapsProvider ncpClientId={ncpClientId}>{children}</NavermapsProvider>
  );
}
