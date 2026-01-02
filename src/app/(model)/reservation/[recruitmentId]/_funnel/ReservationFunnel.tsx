'use client';

import { useRouter } from 'next/navigation';
import { useFunnel } from '@/src/hooks/custom/signup/useFunnel';
import { useReservationStore } from '@/src/stores/reservation/useReservationStore';
import { StepDateTime, StepPhoto, StepContent, StepConfirm } from './steps';

interface ReservationFunnelProps {
  recruitmentId: number;
  /** 샵 이름 */
  shopName: string;
  /** 지점 이름 (선택사항) */
  branchName?: string;
  /** 디자이너 이름 */
  designerName: string;
  /** 카테고리 (헤어, 네일 등) */
  category: string;
  /** 세부 카테고리 목록 */
  subCategories: string[];
}

const STEPS = ['dateTime', 'photo', 'content', 'confirm', 'complete'] as const;

export default function ReservationFunnel({
  recruitmentId,
  shopName,
  branchName,
  designerName,
  category,
  subCategories,
}: ReservationFunnelProps) {
  const router = useRouter();
  const { reset } = useReservationStore();

  const [Funnel, setStep] = useFunnel(STEPS, {
    initialStep: 'dateTime',
  });

  // 뒤로가기 (첫 스텝에서는 페이지 이탈)
  const handleBackFromDateTime = () => {
    reset();
    router.back();
  };

  return (
    <div className="relative min-h-screen bg-white">
      <Funnel>
        <Funnel.Step name="dateTime">
          <StepDateTime
            recruitmentId={recruitmentId}
            shopName={shopName}
            branchName={branchName}
            designerName={designerName}
            goNext={() => setStep('photo')}
            goPrev={handleBackFromDateTime}
          />
        </Funnel.Step>

        {/* Step 2 - 사진 첨부 */}
        <Funnel.Step name="photo">
          <StepPhoto
            category={category}
            goNext={() => setStep('content')}
            goPrev={() => setStep('dateTime')}
          />
        </Funnel.Step>

        {/* Step 3 - 내용 작성 */}
        <Funnel.Step name="content">
          <StepContent
            goNext={() => setStep('confirm')}
            goPrev={() => setStep('photo')}
          />
        </Funnel.Step>

        {/* Step 4 - 예약 확인 */}
        <Funnel.Step name="confirm">
          <StepConfirm
            recruitmentId={recruitmentId}
            shopName={shopName}
            branchName={branchName}
            designerName={designerName}
            category={category}
            subCategories={subCategories}
            goNext={() => setStep('complete')}
            goPrev={() => setStep('content')}
          />
        </Funnel.Step>

        {/* TODO: Step 5 - 완료 */}
        <Funnel.Step name="complete">
          <div className="flex min-h-screen flex-col items-center justify-center bg-white">
            <p className="text-body-2-medium text-gray-500">Step 5: 완료 (구현 예정)</p>
            <button
              type="button"
              onClick={() => {
                reset();
                router.push('/');
              }}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-white"
            >
              확인
            </button>
          </div>
        </Funnel.Step>
      </Funnel>
    </div>
  );
}
