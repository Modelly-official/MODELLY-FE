'use client';

import { useState, useCallback } from 'react';

export interface UserLocation {
  latitude: number;
  longitude: number;
}

interface UseUserLocationOptions {
  onError?: (errorMessage: string) => void;
}

interface UseUserLocationReturn {
  location: UserLocation | null;
  isLoading: boolean;
  requestLocation: () => void;
}

/**
 * 사용자 위치 정보 Hook
 * 거리순 정렬 시 사용자의 위도/경도를 제공합니다.
 * @param options.onError - 위치 획득 실패 시 호출되는 콜백
 */
export function useUserLocation(options: UseUserLocationOptions = {}): UseUserLocationReturn {
  const { onError } = options;
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      onError?.('브라우저가 위치 정보를 지원하지 않습니다.');
      return;
    }

    setIsLoading(true);

    // 고정밀 모드 먼저 시도, 타임아웃 시 저정밀 모드로 폴백
    const tryGetPosition = (highAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (err) => {
          // 고정밀 모드에서 타임아웃 시 저정밀 모드로 재시도
          if (highAccuracy && err.code === err.TIMEOUT) {
            tryGetPosition(false);
            return;
          }

          let errorMessage: string;
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = '위치 정보 접근이 거부되었습니다.';
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case err.TIMEOUT:
              errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
              break;
            default:
              errorMessage = '위치 정보를 가져오는 중 오류가 발생했습니다.';
          }
          onError?.(errorMessage);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: highAccuracy ? 5000 : 15000,
          maximumAge: 300000, // 5분간 캐시
        }
      );
    };

    tryGetPosition(true);
  }, [onError]);

  // 컴포넌트 마운트 시 자동으로 위치 요청하지 않음
  // 거리순 정렬 선택 시에만 requestLocation 호출

  return {
    location,
    isLoading,
    requestLocation,
  };
}
