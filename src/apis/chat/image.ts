import { axiosInstance } from '@/src/apis/axios';
import type { ApiResponse, PresignedUploadResponse } from '@/src/types';

// 채팅 이미지 업로드용 Presigned URL 발급 ( Presigned URL 발급 요청 ->  S3에 직접 파일 업로드)
export const getChatImagePresigned = async (roomId: number | string): Promise<ApiResponse<PresignedUploadResponse>> => {
  try {
    // Presigned URL 발급 요청
    const response = await axiosInstance.post<ApiResponse<PresignedUploadResponse>>(`/presigned-url/chats/${roomId}/`);
    return response.data;
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      const fallback = await axiosInstance.post<ApiResponse<PresignedUploadResponse>>(
        `/chat/rooms/${roomId}/images/presigned`,
      );
      return fallback.data;
    }
    throw err;
  }
};
