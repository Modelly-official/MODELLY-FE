import { axiosInstance } from '../axios';
import { isMockEnabled } from '@/src/config/api';
import {
  mockRecruitmentItems,
  mockRecruitmentDetail,
  mockRecruitmentDetail2,
} from '@/src/mocks/explore';
import type {
  ApiResponse,
  RecruitmentListParams,
  RecruitmentListResponse,
  RecruitmentDetail,
} from '@/src/types';

const DEFAULT_PAGE_SIZE = 20;

/**
 * 공고 목록 조회
 * GET /recruitments
 */
export async function getRecruitments(
  params: RecruitmentListParams = {}
): Promise<ApiResponse<RecruitmentListResponse>> {
  if (isMockEnabled('recruitments')) {
    return getMockRecruitments(params);
  }

  const { data } = await axiosInstance.get<ApiResponse<RecruitmentListResponse>>(
    '/recruitments',
    { params }
  );
  return data;
}

/**
 * 공고 상세 조회
 * GET /recruitments/{recruitmentId}
 */
export async function getRecruitmentDetail(
  recruitmentId: number
): Promise<ApiResponse<RecruitmentDetail>> {
  if (isMockEnabled('recruitmentDetail')) {
    return getMockRecruitmentDetail(recruitmentId);
  }

  const { data } = await axiosInstance.get<ApiResponse<RecruitmentDetail>>(
    `/recruitments/${recruitmentId}`
  );
  return data;
}

// ===== Mock 함수 =====

function getMockRecruitments(
  params: RecruitmentListParams
): Promise<ApiResponse<RecruitmentListResponse>> {
  const { category, subCategory, keyword, sortOption, cursorId, size = DEFAULT_PAGE_SIZE } = params;

  // 필터링
  let filtered = [...mockRecruitmentItems];

  if (category) {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (subCategory) {
    filtered = filtered.filter((item) => item.subCategories.includes(subCategory));
  }

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.designerName.toLowerCase().includes(lowerKeyword) ||
        item.shop.toLowerCase().includes(lowerKeyword)
    );
  }

  // 정렬
  switch (sortOption) {
    case 'MOST_REVIEWS':
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'DISTANCE':
      filtered.sort((a, b) => a.distance - b.distance);
      break;
    case 'NEWEST':
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  // 커서 기반 페이징
  const startIndex = cursorId ? filtered.findIndex((item) => item.recruitmentId === cursorId) + 1 : 0;
  const items = filtered.slice(startIndex, startIndex + size);
  const hasNext = startIndex + size < filtered.length;
  const nextCursor = hasNext ? items[items.length - 1]?.recruitmentId : 0;

  return Promise.resolve({
    isSuccess: true,
    code: 'SUCCESS',
    message: '공고 목록 조회 성공',
    result: {
      items,
      hasNext,
      nextCursor,
    },
  });
}

function getMockRecruitmentDetail(
  recruitmentId: number
): Promise<ApiResponse<RecruitmentDetail>> {
  // ID에 따라 다른 Mock 데이터 반환
  const detail = recruitmentId === 2 ? mockRecruitmentDetail2 : mockRecruitmentDetail;

  return Promise.resolve({
    isSuccess: true,
    code: 'SUCCESS',
    message: '공고 상세 조회 성공',
    result: {
      ...detail,
      recruitmentId,
    },
  });
}
