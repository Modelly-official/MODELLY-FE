// 공고 등록 폼 -> API Request 변환

import type { RecruitmentSchedule, SubCategory } from '@/src/types/recruitment';
import {
  PURPOSE_OPTIONS,
  type RecruitmentFormState,
  type UpdateRecruitmentRequest,
  type ImageUploadResult,
} from '@/src/types/myRecruitment';

/**
 * Store 폼 상태 + 이미지 업로드 결과를 API Request로 변환
 * (생성/수정 모두 사용, imageFolderId는 이미지 변경 시에만 포함)
 */
export function transformFormToRequest(
  formState: RecruitmentFormState,
  uploadResult: ImageUploadResult
): UpdateRecruitmentRequest {
  // 날짜/시간 -> recruitmentSchedule
  const recruitmentSchedule: RecruitmentSchedule[] = formState.selectedDates.map((date) => ({
    recruitmentDate: date,
    recruitmentTimes: formState.selectedTimes[date] || [],
  }));

  // purpose -> goal1 (PURPOSE_OPTIONS에서 name 찾기)
  const goal1 = formState.purpose === 'OTHER'
    ? formState.purposeDetail
    : PURPOSE_OPTIONS.find((opt) => opt.code === formState.purpose)?.name || '';

  return {
    title: formState.title,
    recruitmentSchedule,
    subCategoryList: formState.subCategory ? [formState.subCategory as SubCategory] : [],
    content: formState.content,
    restriction: formState.restrictions, // 유의사항
    notice: formState.notice, // 전달 사항
    goal1,
    thumbnail: uploadResult.thumbnail,
    imageUrls: uploadResult.imageUrls,
    // imageFolderId가 빈 문자열이면 제외 (이미지 변경 없음 → 기존 폴더 유지)
    ...(uploadResult.imageFolderId && { imageFolderId: uploadResult.imageFolderId }),
    agreeVideo: formState.agreeVideo,
    agreeInsta: formState.agreeInsta,
    agreeMosaic: formState.agreeMosaic,
    etc: formState.etc,
  };
}
