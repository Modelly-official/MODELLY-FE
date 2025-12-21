import { axiosInstance } from '@/src/apis/axios';
import type {
  ApiResponse,
  ChatRoomDetailResponse,
  ChatRoomListResponse,
  PresignedUploadResponse,
  CreateChatRoomResponse,
} from '@/src/types';

export const getChatRooms = async (params?: {
  page?: number;
  size?: number;
}): Promise<ApiResponse<ChatRoomListResponse>> => {
  const response = await axiosInstance.get<ApiResponse<ChatRoomListResponse>>('/chat/rooms', {
    params,
  });
  return response.data;
};

export const createChatRoom = async (targetUserId: number): Promise<ApiResponse<CreateChatRoomResponse>> => {
  const response = await axiosInstance.post<ApiResponse<CreateChatRoomResponse>>('/chat/rooms', {
    targetUserId,
  });
  return response.data;
};

export const getChatMessages = async (
  roomId: number | string,
  params?: { cursorMessageId?: number; size?: number },
): Promise<ApiResponse<ChatRoomDetailResponse>> => {
  const response = await axiosInstance.get<ApiResponse<ChatRoomDetailResponse>>(`/chat/rooms/${roomId}/messages`, {
    params,
  });
  return response.data;
};

export const getChatImagePresigned = async (roomId: number | string): Promise<ApiResponse<PresignedUploadResponse>> => {
  // Presigned URL 발급: POST /chat/rooms/{roomId}/images/presigned
  const response = await axiosInstance.post<ApiResponse<PresignedUploadResponse>>(
    `/chat/rooms/${roomId}/images/presigned`,
  );
  return response.data;
};
