import { axiosInstance } from '@/src/apis/axios';
import type { ApiResponse, ChatRoomDetailResponse, ChatRoomListResponse, CreateChatRoomResponse } from '@/src/types';

// 채팅 관련 API
//내 채팅방 목록 조회
export const getChatRooms = async (params?: {
  page?: number;
  size?: number;
}): Promise<ApiResponse<ChatRoomListResponse>> => {
  const response = await axiosInstance.get<ApiResponse<ChatRoomListResponse>>('/chat/rooms', {
    params,
  });
  return response.data;
};

//채팅방 생성 또는 기존 채팅방 조회
export const createChatRoom = async (targetUserId: number): Promise<ApiResponse<CreateChatRoomResponse>> => {
  const response = await axiosInstance.post<ApiResponse<CreateChatRoomResponse>>('/chat/rooms', {
    targetUserId,
  });
  return response.data;
};

// 채팅 내역 조회 (특정 채팅방의 상대 정보 + 메시지 히스토리 조회)
export const getChatMessages = async (
  roomId: number | string,
  params?: { cursorMessageId?: number; size?: number },
): Promise<ApiResponse<ChatRoomDetailResponse>> => {
  const response = await axiosInstance.get<ApiResponse<ChatRoomDetailResponse>>(`/chat/rooms/${roomId}/messages`, {
    params,
  });
  return response.data;
};
