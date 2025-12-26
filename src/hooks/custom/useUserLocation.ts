'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserLocation {
  latitude: number;
  longitude: number;
}

interface UseUserLocationReturn {
  location: UserLocation | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => void;
}

/**
 * 사용자 위치 정보 Hook
 * 거리순 정렬 시 사용자의 위도/경도를 제공합니다.
 */
export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = useCallback(() => {
    console.log('[useUserLocation] requestLocation 호출됨');

    if (!navigator.geolocation) {
      console.log('[useUserLocation] Geolocation API 미지원');
      setError('브라우저가 위치 정보를 지원하지 않습니다.');
      return;
    }

    console.log('[useUserLocation] getCurrentPosition 요청 시작');
    setIsLoading(true);
    setError(null);

    // 먼저 빠른 저정밀 위치 시도, 실패 시 고정밀 위치 시도
    const tryGetPosition = (highAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('[useUserLocation] 위치 정보 획득 성공:', position.coords);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (err) => {
          console.log('[useUserLocation] 위치 정보 오류:', err.code, err.message, { highAccuracy });

          // 고정밀 모드에서 실패 시 저정밀 모드로 재시도
          if (highAccuracy && err.code === err.TIMEOUT) {
            console.log('[useUserLocation] 저정밀 모드로 재시도');
            tryGetPosition(false);
            return;
          }

          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError('위치 정보 접근이 거부되었습니다.');
              break;
            case err.POSITION_UNAVAILABLE:
              setError('위치 정보를 사용할 수 없습니다.');
              break;
            case err.TIMEOUT:
              setError('위치 정보 요청 시간이 초과되었습니다.');
              break;
            default:
              setError('위치 정보를 가져오는 중 오류가 발생했습니다.');
          }
          setIsLoading(false);
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: highAccuracy ? 5000 : 15000, // 고정밀 5초, 저정밀 15초
          maximumAge: 300000, // 5분간 캐시
        }
      );
    };

    tryGetPosition(true);
  }, []);

  // 컴포넌트 마운트 시 자동으로 위치 요청하지 않음
  // 거리순 정렬 선택 시에만 requestLocation 호출

  return {
    location,
    error,
    isLoading,
    requestLocation,
  };
}
