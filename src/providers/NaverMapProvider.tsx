'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import Script from 'next/script';

interface NaverMapContextValue {
  isLoaded: boolean;
  isClusteringLoaded: boolean;
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

// MarkerClustering 스크립트 URL (로컬)
const MARKER_CLUSTERING_SCRIPT_URL = '/scripts/MarkerClustering.js';

export function NaverMapProvider({ children }: NaverMapProviderProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isClusteringLoaded, setIsClusteringLoaded] = useState(false);
  const ncpClientId = process.env.NEXT_PUBLIC_NCP_CLIENT_ID;

  const handleMapScriptLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  const handleClusteringScriptLoad = useCallback(() => {
    setIsClusteringLoaded(true);
  }, []);

  const handleScriptError = useCallback((scriptName: string) => {
    console.error(`${scriptName} 스크립트 로드 실패`);
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

  // 지도와 클러스터링 모두 로드되어야 isLoaded = true
  const isLoaded = isMapLoaded && isClusteringLoaded;

  return (
    <NaverMapContext.Provider value={{ isLoaded, isClusteringLoaded }}>
      {/* 네이버 지도 API 스크립트 */}
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${ncpClientId}`}
        strategy="afterInteractive"
        onLoad={handleMapScriptLoad}
        onError={() => handleScriptError('네이버 지도')}
      />
      {/* MarkerClustering 스크립트 (지도 로드 후) */}
      {isMapLoaded && (
        <Script
          src={MARKER_CLUSTERING_SCRIPT_URL}
          strategy="afterInteractive"
          onLoad={handleClusteringScriptLoad}
          onError={() => handleScriptError('MarkerClustering')}
        />
      )}
      {children}
    </NaverMapContext.Provider>
  );
}
