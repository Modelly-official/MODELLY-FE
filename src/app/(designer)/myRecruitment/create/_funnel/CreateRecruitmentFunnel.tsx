'use client';

import { useRouter } from 'next/navigation';
import { useFunnel } from '@/src/hooks/custom/signup/useFunnel';
import { StepTitleDate, StepContent } from './steps';
import { useCreateRecruitmentSubmit } from '@/src/hooks/custom/myRecruitment';

export default function CreateRecruitmentFunnel() {
  const router = useRouter();

  // 제출 로직 커스텀 훅
  const { isSubmitting, handleSubmit, reset } = useCreateRecruitmentSubmit();

  const [Funnel, setStep] = useFunnel(['titleDate', 'content'] as const, {
    initialStep: 'titleDate',
  });

  // 뒤로가기 (첫 스텝에서는 페이지 이탈)
  const handleBackFromTitleDate = () => {
    reset();
    router.back();
  };

  return (
    <div className="relative min-h-screen bg-white">
      <Funnel>
        <Funnel.Step name="titleDate">
          <StepTitleDate
            goNext={() => setStep('content')}
            goPrev={handleBackFromTitleDate}
          />
        </Funnel.Step>
        <Funnel.Step name="content">
          <StepContent
            goNext={handleSubmit}
            goPrev={() => setStep('titleDate')}
            isSubmitting={isSubmitting}
          />
        </Funnel.Step>
      </Funnel>
    </div>
  );
}
