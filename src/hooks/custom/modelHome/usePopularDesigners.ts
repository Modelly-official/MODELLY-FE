'use client';

import { useMemo } from 'react';
import { useDesigners } from '@/src/hooks/queries/explore';
import type { DesignerListItem } from '@/src/types';
import type { Category } from '@/src/types/recruitment';
import type { HomeCategory } from '@/src/types/modelHome';

export function usePopularDesigners(category: HomeCategory) {
  const queryCategory: Category | undefined = category === 'ALL' ? undefined : (category as Category);

  const query = useDesigners({
    category: queryCategory,
    sortOption: 'MOST_REVIEWS',
    size: 3,
  });

  const items = useMemo<DesignerListItem[]>(() => {
    return query.data?.pages.flatMap((page) => page.result.items) ?? [];
  }, [query.data?.pages]);

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
