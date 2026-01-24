'use client';

import { useMemo } from 'react';
import { useRecruitments } from '@/src/hooks/queries/explore';
import type { Category } from '@/src/types/recruitment';
import type { RecruitmentListItem } from '@/src/types';
import type { HomeCategory } from '@/src/types/modelHome';

export function useTopRecruitments(category: HomeCategory) {
  const queryCategory: Category | undefined = category === 'ALL' ? undefined : (category as Category);

  const query = useRecruitments({
    category: queryCategory,
    sortOption: 'MOST_REVIEWS',
    size: 10,
  });

  const items = useMemo<RecruitmentListItem[]>(() => {
    return query.data?.pages.flatMap((page) => page.result.items) ?? [];
  }, [query.data?.pages]);

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
