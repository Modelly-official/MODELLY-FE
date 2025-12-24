import { useQuery } from '@tanstack/react-query';
import { getChatRooms } from '@/src/apis/chat/chat';
import type { ApiResponse, ChatRoomListResponse } from '@/src/types';

export const chatRoomKeys = {
  all: ['chatRooms'] as const,
  list: () => [...chatRoomKeys.all, 'list'] as const,
};

/**
 * 채팅방 목록 조회 query hook
 */
export function useChatRooms(params?: { page?: number; size?: number; enabled?: boolean }) {
  const { enabled = true, ...queryParams } = params ?? {};

  return useQuery<ApiResponse<ChatRoomListResponse>, Error>({
    queryKey: chatRoomKeys.list(),
    queryFn: () => getChatRooms(Object.keys(queryParams).length > 0 ? queryParams : undefined),
    staleTime: 1000 * 30, // 30초
    refetchInterval: 1000 * 60, // 1분마다 자동 refetch
    enabled,
  });
}
