// 디자이너 내 모집글 관련 타입 정의

import type { Category, SubCategory, RecruitmentSchedule } from '@/src/types/recruitment';

// ===== 내 공고 리스트 조회 =====

/** 내 공고 리스트 조회 파라미터 */
export interface MyRecruitmentListParams {
  month: string; // "2025-11" 형식
  size?: number;
  cursorEarliestDate?: string;
  cursorId?: number;
}

/** 내 공고 리스트 아이템 */
export interface MyRecruitmentListItem {
  recruitmentId: number;
  title: string;
  period: string; // "12.28 ~ 1.1" 형식
  reviewCount: number;
  averageRating: number;
  // UI용 추가 필드 (API 응답에 포함되면 사용)
  thumbnail?: string;
  category?: Category;
  subCategories?: SubCategory[];
}

/** 내 공고 리스트 응답 */
export interface MyRecruitmentListResponse {
  items: MyRecruitmentListItem[];
  hasNext: boolean;
  nextCursor: number;
}

// ===== 공고 생성/수정 =====

/** 공고 생성 요청 */
export interface CreateRecruitmentRequest {
  title: string;
  recruitmentSchedule: RecruitmentSchedule[];
  category: Category;
  subCategoryList: SubCategory[];
  content: string;
  notice: string;
  goal1: string;
  goal2: string;
  goal3: string;
  thumbnail: string;
  imageUrls: string[];
  imageFolderId: string;
  agreeVideo: boolean;
  agreeInsta: boolean;
  agreeMosaic: boolean;
  etc: string;
}

/** 공고 수정 요청 (생성과 동일) */
export type UpdateRecruitmentRequest = CreateRecruitmentRequest;

/** 공고 생성/수정 응답 */
export interface RecruitmentMutationResponse {
  recruitmentId: number;
  title: string;
  recruitmentSchedule: RecruitmentSchedule[];
  category: Category;
  subCategoryList: SubCategory[];
  content: string;
  notice: string;
  goal1: string;
  goal2: string;
  goal3: string;
  thumbnail: string;
  imageUrls: string[];
  agreeVideo: boolean;
  agreeInsta: boolean;
  agreeMosaic: boolean;
  etc: string;
}

// ===== Funnel 폼 상태 =====

/** 공고 등록 Funnel 폼 상태 */
export interface RecruitmentFormState {
  // Step 1: 제목 + 날짜/시간
  title: string;
  selectedDates: string[]; // ["2025-12-30", "2025-12-31"]
  selectedTimes: Record<string, string[]>; // { "2025-12-30": ["10:00", "14:00"] }
  applyTimesToAll: boolean; // "해당 시간으로 일괄 설정" 체크

  // Step 2: 카테고리 + 내용 + 동의
  category: Category | null;
  subCategories: SubCategory[];
  content: string;
  notice: string;
  goals: [string, string, string]; // [goal1, goal2, goal3]
  agreeVideo: boolean;
  agreeInsta: boolean;
  agreeMosaic: boolean;
  etc: string;

  // 이미지
  imageFiles: File[];
  imagePreviewUrls: string[];
  thumbnail: string;
  imageUrls: string[];
  imageFolderId: string;
}

/** 공고 등록 Funnel 스텝 */
export type RecruitmentFunnelStep = 'titleDate' | 'content';

// ===== 유틸리티 타입 =====

/** 날짜 범위 문자열 생성 (예: "12.30 ~ 1.1") */
export function formatDateRange(dates: string[]): string {
  if (dates.length === 0) return '';
  if (dates.length === 1) {
    const date = new Date(dates[0]);
    return `${date.getMonth() + 1}.${date.getDate()}`;
  }

  const sortedDates = [...dates].sort();
  const firstDate = new Date(sortedDates[0]);
  const lastDate = new Date(sortedDates[sortedDates.length - 1]);

  return `${firstDate.getMonth() + 1}.${firstDate.getDate()} ~ ${lastDate.getMonth() + 1}.${lastDate.getDate()}`;
}
