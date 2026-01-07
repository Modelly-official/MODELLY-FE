import { axiosInstance } from '../axios';
import type {
  MypageModelProfileResponse,
  MypageModelProfileUpdateRequest,
  MypageDesignerProfileResponse,
  MypageDesignerProfileUpdateRequest,
} from '@/src/types';

/**
 * 모델 마이페이지 프로필 조회
 * GET /models/mypage/profiles
 */
export async function getModelProfile(): Promise<MypageModelProfileResponse> {
  const { data } = await axiosInstance.get<MypageModelProfileResponse>('/models/mypage/profiles');
  return data;
}

/**
 * 모델 마이페이지 프로필 수정
 * PUT /models/mypage/profiles
 */
export async function updateModelProfile(
  payload: MypageModelProfileUpdateRequest,
): Promise<MypageModelProfileResponse> {
  const { data } = await axiosInstance.put<MypageModelProfileResponse>('/models/mypage/profiles', payload);
  return data;
}

/**
 * 디자이너 마이페이지 프로필 조회
 * GET /designers/mypage/profiles
 */
export async function getDesignerProfile(): Promise<MypageDesignerProfileResponse> {
  const { data } = await axiosInstance.get<MypageDesignerProfileResponse>('/designers/mypage/profiles');
  return data;
}

/**
 * 디자이너 마이페이지 프로필 수정
 * PUT /designers/mypage/profiles
 */
export async function updateDesignerProfile(
  payload: MypageDesignerProfileUpdateRequest,
): Promise<MypageDesignerProfileResponse> {
  const { data } = await axiosInstance.put<MypageDesignerProfileResponse>('/designers/mypage/profiles', payload);
  return data;
}
