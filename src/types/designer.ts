// 디자이너(Designer) 관련 타입 정의

import { Category, SortOption, CursorPaginationResponse } from './recruitment/recruitment';

// ===== 디자이너 리스트 아이템 =====
export interface DesignerListItem {
  designerId: number;
  designerName: string;
  shop: string;
  shopAddress: string;
  designerProfileImage: string;
  category: Category;
  reviewCount: number;
  distance: number;
  isLiked: boolean;
  createdAt: string;
  averageRating: number;
}

// ===== 디자이너 리스트 조회 쿼리 파라미터 =====
export interface DesignerListParams {
  category?: Category;
  keyword?: string;
  sortOption?: SortOption;
  cursorId?: number;
  cursorReviewCount?: number;
  cursorDistance?: number;
  size?: number;
  userLatitude?: number;
  userLongitude?: number;
}

// ===== 디자이너 리스트 응답 =====
export type DesignerListResponse = CursorPaginationResponse<DesignerListItem>;
