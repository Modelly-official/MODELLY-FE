import { useInfiniteQuery } from '@tanstack/react-query';
import { getChatRooms } from '@/src/apis/chat/chat';
import type { ApiResponse, ChatRoomListResponse } from '@/src/types';

const DEFAULT_PAGE_SIZE = 20;

export const chatRoomKeys = {
  all: ['chatRooms'] as const,
  list: (size?: number) => [...chatRoomKeys.all, 'list', { size: size ?? DEFAULT_PAGE_SIZE }] as const,
};

/**
 * 채팅방 목록 조회 infinite query hook
 * - 무한 스크롤 지원
 * - page 기반 페이지네이션
 */
export function useChatRooms(params?: { size?: number; enabled?: boolean }) {
  const { enabled = true, size = DEFAULT_PAGE_SIZE } = params ?? {};

  return useInfiniteQuery<ApiResponse<ChatRoomListResponse>, Error>({
    queryKey: chatRoomKeys.list(size),
    queryFn: async ({ pageParam }) => {
      return getChatRooms({ page: pageParam as number, size });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      // 마지막 페이지의 결과가 size보다 작으면 더 이상 페이지 없음
      const hasMore = (lastPage.result?.length ?? 0) >= size;
      return hasMore ? (lastPageParam as number) + 1 : undefined;
    },
    staleTime: 1000 * 30, // 30초
    refetchInterval: 1000 * 60, // 1분마다 자동 refetch
    enabled,
  });
}
