import { axiosInstance } from '@/src/apis/axios';
import axios from 'axios';
import type { ApiResponse } from '@/src/types';

/**
 * Presigned URL 응답 타입
 */
export interface PresignedUploadResponse {
  uploadUrl: string; // S3에 PUT 업로드할 Presigned URL (유효시간: 5분)
  imageUrl: string; // 업로드 완료 후 DB에 저장할 S3 객체 접근 URL
}

/**
 * 프로필 이미지 업로드용 Presigned URL 발급
 * - 인증 불필요 (permitAll)
 * @returns uploadUrl과 imageUrl
 */
export const getPresignedUrl = async (): Promise<ApiResponse<PresignedUploadResponse>> => {
  const response = await axiosInstance.get<ApiResponse<PresignedUploadResponse>>('/presigned-url/profiles');
  return response.data;
};

/**
 * S3에 이미지 직접 업로드
 * @param uploadUrl - Presigned PUT URL
 * @param file - 업로드할 파일
 */
export const uploadImageToS3 = async (uploadUrl: string, file: File): Promise<void> => {
  // S3에 직접 업로드 (axiosInstance 아닌 일반 axios 사용)
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type, // 파일 타입에 맞게 설정
    },
  });
};

/**
 * 프로필 이미지 업로드 전체 플로우
 * 1. Presigned URL 발급
 * 2. S3에 파일 업로드
 * 3. imageUrl 반환
 * @param file - 업로드할 파일
 * @returns imageUrl - 업로드 완료 후 DB에 저장할 URL
 */
export const uploadProfileImage = async (file: File): Promise<string> => {
  // 1. Presigned URL 발급
  const presignedResponse = await getPresignedUrl();
  if (!presignedResponse.isSuccess || !presignedResponse.result) {
    throw new Error(presignedResponse.message || 'Presigned URL 발급 실패');
  }

  const { uploadUrl, imageUrl } = presignedResponse.result;

  // 2. S3에 파일 업로드
  await uploadImageToS3(uploadUrl, file);

  // 3. imageUrl 반환
  return imageUrl;
};
