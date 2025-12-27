'use client';

import { useRouter } from 'next/navigation';
import { useFunnel } from '@/src/hooks/custom/signup/useFunnel';
import { StepTitleDate, StepContent } from './steps';
import { useRecruitmentFormStore } from '@/src/stores/myRecruitment/useRecruitmentFormStore';

export default function CreateRecruitmentFunnel() {
  const router = useRouter();
  // Selector 패턴: 전체 스토어 구독 대신 reset 함수만 구독 (리렌더링 방지)
  const reset = useRecruitmentFormStore((state) => state.reset);

  const [Funnel, setStep] = useFunnel(['titleDate', 'content'] as const, {
    initialStep: 'titleDate',
  });

  // 뒤로가기 (첫 스텝에서는 페이지 이탈)
  const handleBackFromTitleDate = () => {
    reset(); // 폼 초기화
    router.back();
  };

  // 등록 완료
  const handleSubmit = () => {
    // TODO: API 호출
    console.log('등록 완료');
    reset();
    router.push('/myRecruitment');
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
          />
        </Funnel.Step>
      </Funnel>
    </div>
  );
}
