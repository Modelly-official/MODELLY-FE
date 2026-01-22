import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecruitmentFormStore } from '@/src/stores/myRecruitment/useRecruitmentFormStore';
import { useUpdateRecruitment } from '@/src/hooks/queries/myRecruitment';
import { uploadRecruitmentImages } from '@/src/apis/designer/recruitments';
import { transformFormToRequest } from '@/src/utils/myRecruitment';
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
      // 1. 기존 이미지 URL과 새 이미지 파일 분리
      const { existingUrls, newFiles } = separateImages(
        formState.imagePreviewUrls,
        formState.imageFiles
      );

      let uploadResult: ImageUploadResult;

      if (newFiles.length > 0) {
        // 2. 새 이미지가 있으면 업로드
        const newUpload = await uploadRecruitmentImages(newFiles);

        // 3. 기존 URL + 새 URL 합치기
        uploadResult = {
          thumbnail: existingUrls[0] || newUpload.thumbnail,
          imageUrls: [...existingUrls, ...newUpload.imageUrls],
          imageFolderId: newUpload.imageFolderId,
        };
      } else {
        // 4. 이미지 변경 없음 → 기존 URL 유지
        uploadResult = {
          thumbnail: existingUrls[0] || formState.thumbnail,
          imageUrls: existingUrls,
          imageFolderId: '', // 백엔드가 정상 처리 (API 테스트 확인됨)
        };
      }

      // 5. 폼 데이터 -> API Request 변환
      const request = transformFormToRequest(formState, uploadResult);

      // 6. 수정 API 호출
      updateRecruitment(
        { recruitmentId, request },
        {
          onSuccess: () => {
            reset();
            router.push('/myRecruitment');
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

/**
 * imagePreviewUrls에서 기존 URL과 새 파일 분리
 * - https:// 또는 http:// URL → 기존 이미지 (서버에 이미 있음)
 * - blob: URL → 새 이미지 (업로드 필요)
 *
 * @param previewUrls - 미리보기 URL 배열 (기존 https + 새 blob 혼합)
 * @param imageFiles - 새로 추가된 이미지 File 배열 (blob URL과 1:1 매칭)
 * @returns { existingUrls: 기존 이미지 URL[], newFiles: 업로드할 File[] }
 */
function separateImages(
  previewUrls: string[],
  imageFiles: File[]
): { existingUrls: string[]; newFiles: File[] } {
  const existingUrls: string[] = [];
  const newFiles: File[] = [];

  let blobIndex = 0;
  for (const url of previewUrls) {
    if (url.startsWith('blob:')) {
      // 새 이미지 - File 객체 추가
      if (blobIndex < imageFiles.length) {
        newFiles.push(imageFiles[blobIndex]);
        blobIndex++;
      }
    } else {
      // 기존 이미지 (https://, http://) - URL 유지
      existingUrls.push(url);
    }
  }

  return { existingUrls, newFiles };
}
