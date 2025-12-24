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
    if (!navigator.geolocation) {
      setError('브라우저가 위치 정보를 지원하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
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
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분간 캐시
      }
    );
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
