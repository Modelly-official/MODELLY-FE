// 공고(Recruitment) 관련 타입 정의

// ===== 카테고리 관련 타입 =====
export type Category = 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH';

export type SubCategory =
  | 'HAIR_CUT'
  | 'HAIR_PERM'
  | 'HAIR_COLORING'
  | 'HAIR_MAGIC'
  | 'ONE_COLOR'
  | 'ART'
  | 'PEDICURE'
  | 'EYELASH_PERM'
  | 'EYELASH_EXTENSION'
  | 'LIP_TATTOO'
  | 'EYEBROW_TATTOO'
  | 'NORMAL_TATTOO';

// ===== 정렬 옵션 =====
export type SortOption = 'NEWEST' | 'MOST_REVIEWS' | 'DISTANCE';

// ===== 공고 리스트 아이템 =====
export interface RecruitmentListItem {
  recruitmentId: number;
  title: string;
  designerImage: string;
  designerName: string;
  recruitmentThumbnail: string;
  shop: string;
  shopAddress: string;
  category: string;
  subCategories: string[];
  reviewCount: number;
  distance: number;
  isLiked: boolean;
  createdAt: string;
  averageRating: number;
}

// ===== 공고 리스트 조회 쿼리 파라미터 =====
export interface RecruitmentListParams {
  category?: Category;
  subCategory?: SubCategory;
  keyword?: string;
  sortOption?: SortOption;
  cursorId?: number;
  cursorReviewCount?: number;
  cursorDistance?: number;
  size?: number;
  userLatitude?: number;
  userLongitude?: number;
}

// ===== 페이징 응답 =====
export interface CursorPaginationResponse<T> {
  items: T[];
  hasNext: boolean;
  nextCursor: number;
  totalCount: number;
}

// ===== 공고 리스트 응답 =====
export type RecruitmentListResponse = CursorPaginationResponse<RecruitmentListItem>;

// ===== 공고 상세 =====
export interface DesignerProfile {
  userId: number;
  designerId: number;
  designerName: string;
  shop: string;
  shopAddress: string;
}

export interface RecruitmentSchedule {
  recruitmentDate: string; // "2025-11-28"
  recruitmentTimes: string[];
}

export interface RecruitmentDetail {
  designerProfile: DesignerProfile;
  recruitmentId: number;
  title: string;
  recruitmentSchedule: RecruitmentSchedule[];
  category: string;
  subCategories: string[];
  content: string;
  notice: string; // 전달 사항
  restriction: string; // 유의사항
  goal1: string;
  imageUrls: string[];
  agreeVideo: boolean;
  agreeInsta: boolean;
  agreeMosaic: boolean;
  etc: string;
  isLiked: boolean;
  reviewCount: number;
  averageRating: number;
}

