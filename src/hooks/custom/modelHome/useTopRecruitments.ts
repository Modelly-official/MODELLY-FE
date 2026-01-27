'use client';

import { useMemo } from 'react';
import { useModelHomePopularRecruitments } from '@/src/hooks/queries/modelHome';
import type { Category } from '@/src/types/recruitment';
import type { RecruitmentListItem } from '@/src/types';
import type { HomeCategory } from '@/src/types/modelHome';

interface UseTopRecruitmentsOptions {
  enabled?: boolean;
}

export function useTopRecruitments(category: HomeCategory, options: UseTopRecruitmentsOptions = {}) {
  const { enabled = true } = options;
  const queryCategory: Category | undefined = category === 'ALL' ? undefined : (category as Category);

  const query = useModelHomePopularRecruitments(
    {
      category: queryCategory,
    },
    { enabled },
  );

  const items = useMemo<RecruitmentListItem[]>(() => {
    const rawItems = (query.data?.result ?? []).slice(0, 5);
    return rawItems.map((item) => ({
      recruitmentId: item.recruitmentId,
      title: item.recruitmentTitle,
      designerImage: '',
      designerName: item.designerNickname,
      recruitmentThumbnail: '',
      shop: item.shop,
      shopAddress: '',
      category: item.category,
      subCategories: item.subCategories,
      reviewCount: 0,
      distance: 0,
      isLiked: false,
      createdAt: '',
      averageRating: 0,
    }));
  }, [query.data?.result]);

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
