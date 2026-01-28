import { categoryNameToCode, subCategoryNameToCode } from '../category';
import { PURPOSE_OPTIONS } from '@/src/types/myRecruitment';
import type { RecruitmentSchedule } from '@/src/types/recruitment';
import type { PurposeType, RecruitmentFormState } from '@/src/types/myRecruitment';

/**
 * API 응답에서 폼 상태로 변환할 때 필요한 필드
 */
export interface RecruitmentDetailForConversion {
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
}

/**
 * API 응답 (RecruitmentDetail) -> 폼 상태 (RecruitmentFormState) 변환
 * 수정 모드에서 기존 데이터를 폼에 초기화할 때 사용
 */
export function convertDetailToFormState(
  detail: RecruitmentDetailForConversion,
): Partial<RecruitmentFormState> {
  // 날짜/시간 변환
  const selectedDates = detail.recruitmentSchedule.map((s) => s.recruitmentDate);
  const selectedTimes: Record<string, string[]> = {};
  detail.recruitmentSchedule.forEach((s) => {
    selectedTimes[s.recruitmentDate] = s.recruitmentTimes;
  });

  // 목적 변환 (goal1 -> purpose)
  let purpose: PurposeType | null = null;
  let purposeDetail = '';

  const matchedPurpose = PURPOSE_OPTIONS.find((opt) => opt.name === detail.goal1);
  if (matchedPurpose) {
    purpose = matchedPurpose.code;
  } else if (detail.goal1) {
    purpose = 'OTHER';
    purposeDetail = detail.goal1;
  }

  // 카테고리 변환 (한글 -> 코드)
  const categoryCode = categoryNameToCode(detail.category);

  // 서브카테고리 변환 (한글 -> 코드, 카테고리별로 다름)
  const subCategoryCodes: string[] = [];
  if (categoryCode && detail.subCategories?.length) {
    detail.subCategories.forEach((name) => {
      const code = subCategoryNameToCode(categoryCode, name);
      if (code) subCategoryCodes.push(code);
    });
  }

  return {
    title: detail.title,
    selectedDates,
    selectedTimes,
    applyTimesToAll: false,
    content: detail.content,
    category: categoryCode,
    subCategories: subCategoryCodes,
    restrictions: detail.restriction, // 유의사항
    notice: detail.notice, // 전달 사항
    purpose,
    purposeDetail,
    agreeVideo: detail.agreeVideo,
    agreeInsta: detail.agreeInsta,
    agreeMosaic: detail.agreeMosaic,
    agreeEtc: !!detail.etc,
    etc: detail.etc,
    // 기존 이미지 URL (새 파일 업로드 전까지 유지)
    imageFiles: [],
    imagePreviewUrls: detail.imageUrls || [],
    thumbnail: detail.imageUrls?.[0] || '',
    imageUrls: detail.imageUrls || [],
    imageFolderId: '',
  };
}
