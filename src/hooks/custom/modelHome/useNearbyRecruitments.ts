'use client';

import { useMemo, useEffect, useState, useCallback } from 'react';
import { useModelHomeNearbyRecruitments } from '@/src/hooks/queries/modelHome';
import { useUserLocation } from '@/src/hooks/custom/useUserLocation';
import { useToast } from '@/src/hooks/common/useToast';
import { reverseGeocodeToDistrict } from '@/src/utils/common/locationGeocoder';
import type { Category } from '@/src/types/recruitment';
import type { RecruitmentListItem } from '@/src/types';
import type { HomeCategory } from '@/src/types/modelHome';

const FALLBACK_LOCATION = {
  label: '강남구 논현동',
  latitude: 37.5112,
  longitude: 127.0284,
};
const LOCATION_LOADING_LABEL = '위치 확인 중';

export function useNearbyRecruitments(category: HomeCategory) {
  const { showToast } = useToast();
  const [locationLabel, setLocationLabel] = useState(LOCATION_LOADING_LABEL);

  const handleLocationError = useCallback(
    (message: string) => {
      showToast(message);
      setLocationLabel(FALLBACK_LOCATION.label);
    },
    [showToast]
  );

  const { location, isLoading: isLocationLoading, requestLocation } = useUserLocation({
    autoRequest: true,
    onError: handleLocationError,
  });

  const queryCategory: Category | undefined = category === 'ALL' ? undefined : (category as Category);
  const activeLocation = location ?? FALLBACK_LOCATION;

  const query = useModelHomeNearbyRecruitments(
    {
      category: queryCategory,
      userLatitude: activeLocation.latitude,
      userLongitude: activeLocation.longitude,
    },
    {
      enabled: !isLocationLoading,
    },
  );

  const items = useMemo<RecruitmentListItem[]>(() => {
    return (query.data?.result ?? []).slice(0, 10);
  }, [query.data?.result]);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    if (!location) return;

    const updateLabel = async (attempt = 0) => {
      try {
        const label = await reverseGeocodeToDistrict(location.latitude, location.longitude);
        if (!cancelled) {
          if (label) {
            setLocationLabel(label);
            return;
          }

          if (attempt === 0) {
            retryTimer = setTimeout(() => {
              updateLabel(1);
            }, 500);
            return;
          }

          setLocationLabel(FALLBACK_LOCATION.label);
        }
      } catch {
        if (!cancelled) {
          if (attempt === 0) {
            retryTimer = setTimeout(() => {
              updateLabel(1);
            }, 500);
            return;
          }

          setLocationLabel(FALLBACK_LOCATION.label);
        }
      }
    };

    updateLabel();

    return () => {
      cancelled = true;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
    };
  }, [location, showToast]);

  const handleRequestLocation = useCallback(() => {
    setLocationLabel(LOCATION_LOADING_LABEL);
    requestLocation();
  }, [requestLocation]);

  const displayLocationLabel = useMemo(() => {
    if (location) return locationLabel;
    if (isLocationLoading) return LOCATION_LOADING_LABEL;
    return FALLBACK_LOCATION.label;
  }, [isLocationLoading, location, locationLabel]);

  return {
    items,
    isLoading: isLocationLoading || query.isLoading,
    isLocationLoading,
    locationLabel: displayLocationLabel,
    showLocationCta: !location && !isLocationLoading && displayLocationLabel !== LOCATION_LOADING_LABEL,
    requestLocation: handleRequestLocation,
    activeLocation,
  };
}
