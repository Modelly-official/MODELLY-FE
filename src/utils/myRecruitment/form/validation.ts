import type { PurposeType } from '@/src/types/myRecruitment';

/**
 * 모든 선택된 날짜에 시간이 선택되었는지 확인
 */
export function hasAllTimesSelected(
  selectedDates: string[],
  selectedTimes: Record<string, string[]>,
): boolean {
  return selectedDates.every((date) => selectedTimes[date]?.length > 0);
}

/**
 * 이미지가 필수 조건을 충족하는지 확인
 * - 생성 모드: 새 파일이 있어야 함
 * - 수정 모드: 새 파일 또는 기존 이미지가 있어야 함
 */
export function hasRequiredImages(
  imageFiles: File[],
  imagePreviewUrls: string[],
  isEditMode: boolean,
): boolean {
  return imageFiles.length > 0 || (isEditMode && imagePreviewUrls.length > 0);
}

/**
 * Step 1 유효성 검증: 제목 + 날짜 + 시간
 */
export function isStep1Valid(state: {
  title: string;
  selectedDates: string[];
  selectedTimes: Record<string, string[]>;
}): boolean {
  const { title, selectedDates, selectedTimes } = state;

  return (
    title.trim().length > 0 && selectedDates.length > 0 && hasAllTimesSelected(selectedDates, selectedTimes)
  );
}

/**
 * Step 2 유효성 검증: 내용 + 카테고리 + 제한사항 + 전달사항 + 이미지 + 목적
 */
export function isStep2Valid(
  state: {
    content: string;
    subCategories: string[];
    restrictions: string;
    notice: string;
    imageFiles: File[];
    imagePreviewUrls: string[];
    purpose: PurposeType | null;
    purposeDetail: string;
  },
  options?: { isEditMode?: boolean },
): boolean {
  const { content, subCategories, restrictions, notice, imageFiles, imagePreviewUrls, purpose, purposeDetail } =
    state;
  const isEditMode = options?.isEditMode ?? false;

  const hasImages = hasRequiredImages(imageFiles, imagePreviewUrls, isEditMode);
  const isPurposeValid = purpose !== 'OTHER' || purposeDetail.trim().length > 0;

  return (
    content.trim().length > 0 &&
    subCategories.length > 0 &&
    restrictions.trim().length > 0 &&
    notice.trim().length > 0 &&
    hasImages &&
    isPurposeValid
  );
}
