'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFunnel } from '@/src/hooks/custom/signup/useFunnel';
import { StepTitleDate, StepContent } from '@/src/app/(designer)/myRecruitment/create/_funnel/steps';
import { useUpdateRecruitmentSubmit } from '@/src/hooks/custom/myRecruitment/useUpdateRecruitmentSubmit';
import { useRecruitmentDetail } from '@/src/hooks/queries/explore';
import { useRecruitmentFormStore } from '@/src/stores/myRecruitment/useRecruitmentFormStore';
import { convertDetailToFormState } from '@/src/utils/myRecruitment';

interface EditRecruitmentFunnelProps {
  recruitmentId: number;
}

export default function EditRecruitmentFunnel({ recruitmentId }: EditRecruitmentFunnelProps) {
  const router = useRouter();
  const isInitializedRef = useRef(false);

  // 기존 공고 데이터 조회
  const { data, isLoading, isError } = useRecruitmentDetail(recruitmentId);
  const initForEdit = useRecruitmentFormStore((state) => state.initForEdit);

  // 제출 로직 커스텀 훅
  const { isSubmitting, handleSubmit, reset } = useUpdateRecruitmentSubmit(recruitmentId);

  // 기존 데이터로 폼 초기화
  useEffect(() => {
    if (data?.result && !isInitializedRef.current) {
      isInitializedRef.current = true;
      const formState = convertDetailToFormState(data.result);
      initForEdit(formState);
    }
  }, [data, initForEdit]);

  const [Funnel, setStep] = useFunnel(['titleDate', 'content'] as const, {
    initialStep: 'titleDate',
  });

  // 뒤로가기 (첫 스텝에서는 페이지 이탈)
  const handleBackFromTitleDate = () => {
    reset();
    router.back();
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  // 에러
  if (isError || !data?.result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-1-medium text-gray-600">공고 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <Funnel>
        <Funnel.Step name="titleDate">
          <StepTitleDate goNext={() => setStep('content')} goPrev={handleBackFromTitleDate} isEdit />
        </Funnel.Step>
        <Funnel.Step name="content">
          <StepContent goNext={handleSubmit} goPrev={() => setStep('titleDate')} isSubmitting={isSubmitting} isEdit />
        </Funnel.Step>
      </Funnel>
    </div>
  );
}
