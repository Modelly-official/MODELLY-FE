import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecruitmentFormStore } from '@/src/stores/myRecruitment/useRecruitmentFormStore';
import { useUpdateRecruitment } from '@/src/hooks/queries/myRecruitment';
import { uploadRecruitmentImages } from '@/src/apis/designer/recruitments';
import { transformFormToRequest } from '@/src/utils/myRecruitment';
import { useToast } from '@/src/hooks/common/useToast';

/**
 * 공고 수정 제출 로직을 관리하는 커스텀 훅
 * - 이미지 업로드 (새 이미지가 있는 경우)
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
      let uploadResult = {
        thumbnail: formState.thumbnail,
        imageUrls: formState.imageUrls,
        imageFolderId: formState.imageFolderId,
      };

      // 새 이미지 파일이 있으면 업로드
      if (formState.imageFiles.length > 0) {
        uploadResult = await uploadRecruitmentImages(formState.imageFiles);
      }

      // 폼 데이터 -> API Request 변환
      const request = transformFormToRequest(formState, uploadResult);

      // 수정 API 호출
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
