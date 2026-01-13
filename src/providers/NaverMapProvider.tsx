'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import Script from 'next/script';

interface NaverMapContextValue {
  isLoaded: boolean;
}

const NaverMapContext = createContext<NaverMapContextValue | null>(null);

export function useNaverMap() {
  const context = useContext(NaverMapContext);
  if (!context) {
    throw new Error('useNaverMap must be used within NaverMapProvider');
  }
  return context;
}

interface NaverMapProviderProps {
  children: React.ReactNode;
}

export function NaverMapProvider({ children }: NaverMapProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const ncpClientId = process.env.NEXT_PUBLIC_NCP_CLIENT_ID;

  const handleScriptLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleScriptError = useCallback(() => {
    console.error('네이버 지도 스크립트 로드 실패');
  }, []);

  if (!ncpClientId) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-body-1-semibold text-gray-900">지도를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <NaverMapContext.Provider value={{ isLoaded }}>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${ncpClientId}`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
      {children}
    </NaverMapContext.Provider>
  );
}
