import { axiosInstance } from '../axios';
import { isMockEnabled } from '@/src/config/api';
import { mockDesignerItems } from '@/src/mocks/explore';
import type { ApiResponse, DesignerListParams, DesignerListResponse } from '@/src/types';

const DEFAULT_PAGE_SIZE = 8;

/**
 * 디자이너 목록 조회
 * GET /designers
 */
export async function getDesigners(
  params: DesignerListParams = {}
): Promise<ApiResponse<DesignerListResponse>> {
  if (isMockEnabled('designers')) {
    return getMockDesigners(params);
  }

  const { size = DEFAULT_PAGE_SIZE, ...restParams } = params;
  const { data } = await axiosInstance.get<ApiResponse<DesignerListResponse>>('/designers', {
    params: { ...restParams, size },
  });
  return data;
}

// ===== Mock 함수 =====

function getMockDesigners(
  params: DesignerListParams
): Promise<ApiResponse<DesignerListResponse>> {
  const { category, keyword, sortOption, cursorId, size = DEFAULT_PAGE_SIZE } = params;

  // 필터링
  let filtered = [...mockDesignerItems];

  if (category) {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = filtered.filter(
      (item) =>
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
  const startIndex = cursorId
    ? filtered.findIndex((item) => item.designerId === cursorId) + 1
    : 0;
  const items = filtered.slice(startIndex, startIndex + size);
  const hasNext = startIndex + size < filtered.length;
  const nextCursor = hasNext ? items[items.length - 1]?.designerId : 0;

  return Promise.resolve({
    isSuccess: true,
    code: 'SUCCESS',
    message: '디자이너 목록 조회 성공',
    result: {
      items,
      hasNext,
      nextCursor,
      totalCount: filtered.length,
    },
  });
}
