'use client';

import { useMemo } from 'react';
import { useModelHomePopularDesigners } from '@/src/hooks/queries/modelHome';
import type { UserLocation } from '@/src/hooks/custom/useUserLocation';
import type { DesignerListItem } from '@/src/types';
import type { Category } from '@/src/types/recruitment';
import type { HomeCategory } from '@/src/types/modelHome';

export function usePopularDesigners(category: HomeCategory, location?: UserLocation | null, isLocationLoading = false) {
  const queryCategory: Category | undefined = category === 'ALL' ? undefined : (category as Category);

  const query = useModelHomePopularDesigners(
    {
      category: queryCategory,
      userLatitude: location?.latitude ?? 0,
      userLongitude: location?.longitude ?? 0,
    },
    {
      enabled: !isLocationLoading && !!location,
    },
  );

  const items = useMemo<DesignerListItem[]>(() => {
    return query.data?.result ?? [];
  }, [query.data?.result]);

  return {
    items,
    isLoading: isLocationLoading || query.isLoading,
    isError: query.isError,
  };
}
