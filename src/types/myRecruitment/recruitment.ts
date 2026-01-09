// 디자이너 내 모집글 관련 타입 정의

import type { Category, SubCategory, RecruitmentSchedule } from '@/src/types/recruitment';

// ===== Presigned URL (공고 이미지 업로드용) =====

/** 단일 Presigned URL */
export interface PresignedUrl {
  uploadUrl: string; // S3에 PUT 업로드할 Presigned URL (유효시간: 5분)
  imageUrl: string; // 업로드 완료 후 사용할 S3 객체 접근 URL
}

/** 공고 이미지용 Presigned URL 응답 */
export interface RecruitmentPresignedUrlResponse {
  folderId: string; // 이미지 폴더 ID
  presignedUrls: PresignedUrl[]; // Presigned URL 리스트
  thumbnailUrl: string; // 썸네일 URL
}

/** 이미지 업로드 결과 (공고 생성 시 사용) */
export interface ImageUploadResult {
  thumbnail: string;
  imageUrls: string[];
  imageFolderId: string;
}

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
  period: string; // "2026-01-03 ~ 2026-01-17" 형식 (YYYY-MM-DD ~ YYYY-MM-DD)
  reviewCount: number;
  averageRating: number;
  thumbnail?: string;
  subCategory?: string[]; // 서브카테고리 배열 (예: ["커트"])
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
  subCategoryList: SubCategory[];
  content: string;
  restriction: string; // 유의사항
  notice: string; // 전달 사항
  goal1: string;
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
  subCategoryList: SubCategory[];
  content: string;
  restriction: string; // 유의사항
  notice: string; // 전달 사항
  goal1: string;
  thumbnail: string;
  imageUrls: string[];
  agreeVideo: boolean;
  agreeInsta: boolean;
  agreeMosaic: boolean;
  etc: string;
}

// ===== Funnel 폼 상태 =====

/** 목적 타입 */
export type PurposeType = 'PORTFOLIO' | 'COMPETITION' | 'OTHER';

/** 목적 옵션 */
export const PURPOSE_OPTIONS = [
  { code: 'PORTFOLIO' as PurposeType, name: '포트폴리오' },
  { code: 'COMPETITION' as PurposeType, name: '대회 및 시험' },
  { code: 'OTHER' as PurposeType, name: '기타(직접 작성)' },
] as const;

/** 공고 등록 Funnel 폼 상태 */
export interface RecruitmentFormState {
  // Step 1: 제목 + 날짜/시간
  title: string;
  selectedDates: string[]; // ["2025-12-30", "2025-12-31"]
  selectedTimes: Record<string, string[]>; // { "2025-12-30": ["10:00", "14:00"] }
  applyTimesToAll: boolean; // "해당 시간으로 일괄 설정" 체크

  // Step 2: 시술 내용 + 카테고리 + 제한사항 + 전달사항 + 목적 + 동의
  content: string; // 시술 내용
  category: Category | null; // 메인 카테고리 (HAIR, NAIL 등)
  subCategory: string | null; // 서브 카테고리 (커트, 염색, 펌, 기타)
  restrictions: string; // 제한 사항
  notice: string; // 전달 사항
  purpose: PurposeType | null; // 목적
  purposeDetail: string; // 목적 상세 (기타 선택 시)

  // 사전 동의 사항
  agreeVideo: boolean; // 영상 촬영
  agreeInsta: boolean; // 인스타 업로드
  agreeMosaic: boolean; // 모자이크 가능
  agreeEtc: boolean; // 그 외(직접 작성)
  etc: string; // 그 외 상세 내용

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
