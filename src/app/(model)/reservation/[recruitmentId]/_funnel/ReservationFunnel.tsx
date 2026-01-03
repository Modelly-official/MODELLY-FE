'use client';

import { useRouter } from 'next/navigation';
import { useFunnel } from '@/src/hooks/custom/signup/useFunnel';
import { useReservationStore } from '@/src/stores/reservation/useReservationStore';
import { StepDateTime, StepPhoto, StepContent, StepConfirm, StepComplete } from './steps';

interface ReservationFunnelProps {
  recruitmentId: number;
  /** 샵 이름 */
  shopName: string;
  /** 샵 주소 */
  shopAddress: string;
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
  shopAddress,
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
            shopAddress={shopAddress}
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
            shopAddress={shopAddress}
            designerName={designerName}
            category={category}
            subCategories={subCategories}
            goNext={() => setStep('complete')}
            goPrev={() => setStep('content')}
          />
        </Funnel.Step>

        {/* Step 5 - 완료 */}
        <Funnel.Step name="complete">
          <StepComplete />
        </Funnel.Step>
      </Funnel>
    </div>
  );
}
