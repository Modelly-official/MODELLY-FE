import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecruitmentFormStore } from '@/src/stores/myRecruitment/useRecruitmentFormStore';
import { useUpdateRecruitment } from '@/src/hooks/queries/myRecruitment';
import { uploadRecruitmentImages } from '@/src/apis/designer/recruitments';
import { transformFormToRequest } from '@/src/utils/myRecruitment';
import { prepareAllImagesAsFiles, hasImageChanges } from '@/src/utils/image';
import { useToast } from '@/src/hooks/common/useToast';
import type { ImageUploadResult } from '@/src/types/myRecruitment';

/**
 * 공고 수정 제출 로직을 관리하는 커스텀 훅
 * - 기존 이미지 URL 유지 + 새 이미지만 업로드
 * - 폼 데이터 변환
 * - 수정 API 호출
 * - 에러 처리
 */
export function useUpdateRecruitmentSubmit(recruitmentId: number) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formState = useRecruitmentFormStore();
  const reset = useRecruitmentFormStore((state) => state.reset);
  const { mutate: updateRecruitment } = useUpdateRecruitment();

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 원본 이미지 URL (수정 모드 초기화 시 저장됨)
      const originalUrls = formState.imageUrls;

      // 이미지 변경 여부 확인
      const imageChanged = hasImageChanges(
        originalUrls,
        formState.imagePreviewUrls,
        formState.imageFiles
      );

      let uploadResult: ImageUploadResult;

      if (imageChanged && formState.imagePreviewUrls.length > 0) {
        // 이미지가 변경됨 → 모든 이미지를 새 폴더에 재업로드
        let allFiles: File[];
        try {
          allFiles = await prepareAllImagesAsFiles(
            formState.imagePreviewUrls,
            formState.imageFiles
          );
        } catch {
          showToast('기존 이미지를 불러오는 중 오류가 발생했습니다.');
          setIsSubmitting(false);
          return;
        }

        try {
          const newUpload = await uploadRecruitmentImages(allFiles);
          uploadResult = {
            thumbnail: newUpload.thumbnail,
            imageUrls: newUpload.imageUrls,
            imageFolderId: newUpload.imageFolderId,
          };
        } catch {
          showToast('이미지 업로드에 실패했습니다.');
          setIsSubmitting(false);
          return;
        }
      } else if (!imageChanged && formState.imagePreviewUrls.length > 0) {
        // 이미지 변경 없음 → 기존 URL 유지, imageFolderId 전송 안함
        uploadResult = {
          thumbnail: formState.imagePreviewUrls[0] || formState.thumbnail,
          imageUrls: formState.imagePreviewUrls,
          imageFolderId: '', // 빈 문자열 → transformFormToRequest에서 제외 처리 필요
        };
      } else {
        // 이미지 없음
        uploadResult = {
          thumbnail: '',
          imageUrls: [],
          imageFolderId: '',
        };
      }

      // 폼 데이터 -> API Request 변환
      const request = transformFormToRequest(formState, uploadResult);

      // 수정 API 호출
      updateRecruitment(
        { recruitmentId, request },
        {
          onSuccess: () => {
            reset();
            // 상세 페이지로 이동 (백엔드 처리 지연 대응 + 수정 결과 확인)
            router.push(`/myRecruitment/${recruitmentId}`);
          },
          onError: () => {
            setIsSubmitting(false);
          },
        }
      );
    } catch {
      showToast('이미지 업로드에 실패했습니다.');
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
    reset,
  };
}
