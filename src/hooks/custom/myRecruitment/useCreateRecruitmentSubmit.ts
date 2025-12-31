import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecruitmentFormStore } from '@/src/stores/myRecruitment/useRecruitmentFormStore';
import { useCreateRecruitment } from '@/src/hooks/queries/myRecruitment';
import { uploadRecruitmentImages } from '@/src/apis/designer/recruitments';
import { transformFormToRequest } from '@/src/utils/myRecruitment';
import { useToast } from '@/src/hooks/common/useToast';

/**
 * 공고 등록 제출 로직을 관리하는 커스텀 훅
 * - 이미지 업로드
 * - 폼 데이터 변환
 * - API 호출
 * - 에러 처리
 */
export function useCreateRecruitmentSubmit() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formState = useRecruitmentFormStore();
  const reset = useRecruitmentFormStore((state) => state.reset);
  const { mutate: createRecruitment } = useCreateRecruitment();

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 1. 이미지 업로드
      const uploadResult = await uploadRecruitmentImages(formState.imageFiles);

      // 2. 폼 데이터 -> API Request 변환
      const request = transformFormToRequest(formState, uploadResult);

      // 3. API 호출
      createRecruitment(request, {
        onSuccess: () => {
          reset();
          router.push('/myRecruitment');
        },
        onError: () => {
          setIsSubmitting(false);
        },
      });
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
