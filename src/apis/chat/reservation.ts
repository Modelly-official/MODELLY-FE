import { axiosInstance } from '@/src/apis/axios';
import type { ApiResponse, ChatRoomReservationSummaryResponse } from '@/src/types';

// 채팅방 내 예약 내역 관련 API
export const getChatRoomReservationSummary = async (
  roomId: number | string,
): Promise<ApiResponse<ChatRoomReservationSummaryResponse>> => {
  const response = await axiosInstance.get<ApiResponse<ChatRoomReservationSummaryResponse>>(
    `/chat/rooms/${roomId}/reservation`,
  );
  return response.data;
};
