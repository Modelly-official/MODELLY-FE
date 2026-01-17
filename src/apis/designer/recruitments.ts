import { axiosInstance } from '../axios';
import { uploadImageToS3 } from '../auth/profile';
import { isMockEnabled } from '@/src/config/api';
import { mockMyRecruitmentItems } from '@/src/mocks/myRecruitment';
import type { ApiResponse } from '@/src/types';
import type {
  MyRecruitmentListParams,
  MyRecruitmentListResponse,
  CreateRecruitmentRequest,
  UpdateRecruitmentRequest,
  RecruitmentMutationResponse,
  RecruitmentPresignedUrlResponse,
  ImageUploadResult,
} from '@/src/types/myRecruitment';

const DEFAULT_PAGE_SIZE = 10;

/**
 * 디자이너 내 공고 목록 조회
 * GET /designers/recruitments
 */
export async function getDesignerRecruitments(
  params: MyRecruitmentListParams
): Promise<ApiResponse<MyRecruitmentListResponse>> {
  if (isMockEnabled('designerRecruitments')) {
    return getMockDesignerRecruitments(params);
  }

  const { data } = await axiosInstance.get<ApiResponse<MyRecruitmentListResponse>>(
    '/designers/recruitments',
    { params }
  );
  return data;
}

/**
 * 공고 생성
 * POST /designers/recruitments
 */
export async function createRecruitment(
  request: CreateRecruitmentRequest
): Promise<ApiResponse<RecruitmentMutationResponse>> {
  if (isMockEnabled('designerRecruitments')) {
    return getMockCreateRecruitment(request);
  }

  const { data } = await axiosInstance.post<ApiResponse<RecruitmentMutationResponse>>(
    '/designers/recruitments',
    request
  );
  return data;
}

/**
 * 공고 수정
 * PUT /designers/recruitments/{recruitmentId}
 */
export async function updateRecruitment(
  recruitmentId: number,
  request: UpdateRecruitmentRequest
): Promise<ApiResponse<RecruitmentMutationResponse>> {
  if (isMockEnabled('designerRecruitments')) {
    return getMockUpdateRecruitment(recruitmentId, request);
  }

  const { data } = await axiosInstance.put<ApiResponse<RecruitmentMutationResponse>>(
    `/designers/recruitments/${recruitmentId}`,
    request
  );
  return data;
}

/**
 * 공고 삭제
 * DELETE /designers/recruitments/{recruitmentId}
 */
export async function deleteRecruitment(
  recruitmentId: number
): Promise<ApiResponse<string>> {
  if (isMockEnabled('designerRecruitments')) {
    return getMockDeleteRecruitment(recruitmentId);
  }

  const { data } = await axiosInstance.delete<ApiResponse<string>>(
    `/designers/recruitments/${recruitmentId}`
  );
  return data;
}

/**
 * 공고 이미지용 Presigned URL 발급
 * GET /presigned-url/recruitments
 */
export async function getRecruitmentPresignedUrls(
  imageCount: number
): Promise<ApiResponse<RecruitmentPresignedUrlResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<RecruitmentPresignedUrlResponse>>(
    '/presigned-url/recruitments',
    { params: { imageCount } }
  );
  return data;
}

/**
 * 공고 이미지 업로드 전체 플로우
 * 1. Presigned URL 발급
 * 2. S3에 병렬 업로드
 * 3. 결과 반환 (thumbnail, imageUrls, imageFolderId)
 */
export async function uploadRecruitmentImages(files: File[]): Promise<ImageUploadResult> {
  if (files.length === 0) {
    throw new Error('업로드할 이미지가 없습니다.');
  }

  // 1. Presigned URL 발급
  const presignedResponse = await getRecruitmentPresignedUrls(files.length);

  if (!presignedResponse.isSuccess || !presignedResponse.result) {
    throw new Error(presignedResponse.message || 'Presigned URL 발급 실패');
  }

  const { folderId, presignedUrls, thumbnailUrl } = presignedResponse.result;

  // 2. S3에 병렬 업로드
  await Promise.all(
    files.map((file, index) => uploadImageToS3(presignedUrls[index].uploadUrl, file))
  );

  // 3. 결과 반환
  return {
    thumbnail: thumbnailUrl,
    imageUrls: presignedUrls.map((item) => item.imageUrl),
    imageFolderId: folderId,
  };
}

// ===== Mock 함수 =====

function getMockDesignerRecruitments(
  params: MyRecruitmentListParams
): Promise<ApiResponse<MyRecruitmentListResponse>> {
  const { status, month, size = DEFAULT_PAGE_SIZE, cursorId } = params;

  let filteredItems;

  if (status === 'CLOSED') {
    // 마감 공고: 월 필터 없이 전체 반환 (실제로는 마감된 공고만)
    filteredItems = mockMyRecruitmentItems
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ _month, ...rest }) => rest);
  } else {
    // 모집중 공고: 해당 월에 맞는 공고 필터링
    filteredItems = mockMyRecruitmentItems
      .filter((item) => item._month === month)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ _month, ...rest }) => rest);
  }

  // 커서 기반 페이징
  const startIndex = cursorId
    ? filteredItems.findIndex((item) => item.recruitmentId === cursorId) + 1
    : 0;
  const items = filteredItems.slice(startIndex, startIndex + size);
  const hasNext = startIndex + size < filteredItems.length;
  const nextCursor = hasNext ? items[items.length - 1]?.recruitmentId : 0;

  return Promise.resolve({
    isSuccess: true,
    code: 'SUCCESS',
    message: '내 공고 목록 조회 성공',
    result: {
      items,
      hasNext,
      nextCursor,
    },
  });
}

function getMockCreateRecruitment(
  request: CreateRecruitmentRequest
): Promise<ApiResponse<RecruitmentMutationResponse>> {
  return Promise.resolve({
    isSuccess: true,
    code: 'SUCCESS',
    message: '공고 생성 성공',
    result: {
      recruitmentId: Math.floor(Math.random() * 1000) + 100,
      ...request,
    },
  });
}

function getMockUpdateRecruitment(
  recruitmentId: number,
  request: UpdateRecruitmentRequest
): Promise<ApiResponse<RecruitmentMutationResponse>> {
  return Promise.resolve({
    isSuccess: true,
    code: 'SUCCESS',
    message: '공고 수정 성공',
    result: {
      recruitmentId,
      ...request,
    },
  });
}

function getMockDeleteRecruitment(recruitmentId: number): Promise<ApiResponse<string>> {
  return Promise.resolve({
    isSuccess: true,
    code: 'SUCCESS',
    message: '공고 삭제 성공',
    result: `공고 ${recruitmentId}가 삭제되었습니다.`,
  });
}
