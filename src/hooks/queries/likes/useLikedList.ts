import { useInfiniteQuery } from '@tanstack/react-query';
import { getLikedDesigners, getLikedRecruitments } from '@/src/apis';
import type {
  Category,
  ApiResponse,
  LikedDesignersResponse,
  LikedRecruitmentsResponse,
} from '@/src/types';

// Query Key Factory
export const likedListKeys = {
  all: ['liked'] as const,
  designers: () => [...likedListKeys.all, 'designers'] as const,
  designerList: (category?: Category) => [...likedListKeys.designers(), category] as const,
  recruitments: () => [...likedListKeys.all, 'recruitments'] as const,
  recruitmentList: (category?: Category) => [...likedListKeys.recruitments(), category] as const,
};

interface UseLikedListParams {
  category?: Category;
  enabled?: boolean;
}

/**
 * 찜한 디자이너 목록 무한 스크롤 Hook
 */
export function useLikedDesigners(params: UseLikedListParams = {}) {
  const { category, enabled = true } = params;

  return useInfiniteQuery<
    ApiResponse<LikedDesignersResponse>,
    Error,
    { pages: ApiResponse<LikedDesignersResponse>[]; pageParams: (number | undefined)[] },
    ReturnType<typeof likedListKeys.designerList>,
    number | undefined
  >({
    queryKey: likedListKeys.designerList(category),
    queryFn: async ({ pageParam }) => {
      return getLikedDesigners({
        category,
        cursorId: pageParam,
        size: 20,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.result.hasNext) return undefined;
      return lastPage.result.nextCursor ?? undefined;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 찜한 공고 목록 무한 스크롤 Hook
 */
export function useLikedRecruitments(params: UseLikedListParams = {}) {
  const { category, enabled = true } = params;

  return useInfiniteQuery<
    ApiResponse<LikedRecruitmentsResponse>,
    Error,
    { pages: ApiResponse<LikedRecruitmentsResponse>[]; pageParams: (number | undefined)[] },
    ReturnType<typeof likedListKeys.recruitmentList>,
    number | undefined
  >({
    queryKey: likedListKeys.recruitmentList(category),
    queryFn: async ({ pageParam }) => {
      return getLikedRecruitments({
        category,
        cursorId: pageParam,
        size: 20,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.result.hasNext) return undefined;
      return lastPage.result.nextCursor ?? undefined;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
