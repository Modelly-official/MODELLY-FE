'use client';

import { useRouter } from 'next/navigation';
import { useFunnel } from '@/src/hooks/custom/signup/useFunnel';
import { useReservationStore } from '@/src/stores/reservation/useReservationStore';
import { StepDateTime } from './steps';

interface ReservationFunnelProps {
  recruitmentId: number;
  /** 샵 이름 */
  shopName: string;
  /** 지점 이름 (선택사항) */
  branchName?: string;
  /** 디자이너 이름 */
  designerName: string;
}

const STEPS = ['dateTime', 'photo', 'content', 'confirm', 'complete'] as const;

export default function ReservationFunnel({
  recruitmentId,
  shopName,
  branchName,
  designerName,
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

        {/* TODO: Step 2 - 사진 첨부 */}
        <Funnel.Step name="photo">
          <div className="flex min-h-screen flex-col items-center justify-center bg-white">
            <p className="text-body-2-medium text-gray-500">Step 2: 사진 첨부 (구현 예정)</p>
            <div className="mt-4 flex gap-4">
              <button
                type="button"
                onClick={() => setStep('dateTime')}
                className="rounded-lg bg-gray-200 px-4 py-2"
              >
                이전
              </button>
              <button
                type="button"
                onClick={() => setStep('content')}
                className="rounded-lg bg-gray-900 px-4 py-2 text-white"
              >
                다음
              </button>
            </div>
          </div>
        </Funnel.Step>

        {/* TODO: Step 3 - 내용 작성 */}
        <Funnel.Step name="content">
          <div className="flex min-h-screen flex-col items-center justify-center bg-white">
            <p className="text-body-2-medium text-gray-500">Step 3: 내용 작성 (구현 예정)</p>
            <div className="mt-4 flex gap-4">
              <button
                type="button"
                onClick={() => setStep('photo')}
                className="rounded-lg bg-gray-200 px-4 py-2"
              >
                이전
              </button>
              <button
                type="button"
                onClick={() => setStep('confirm')}
                className="rounded-lg bg-gray-900 px-4 py-2 text-white"
              >
                다음
              </button>
            </div>
          </div>
        </Funnel.Step>

        {/* TODO: Step 4 - 예약 확인 */}
        <Funnel.Step name="confirm">
          <div className="flex min-h-screen flex-col items-center justify-center bg-white">
            <p className="text-body-2-medium text-gray-500">Step 4: 예약 확인 (구현 예정)</p>
            <div className="mt-4 flex gap-4">
              <button
                type="button"
                onClick={() => setStep('content')}
                className="rounded-lg bg-gray-200 px-4 py-2"
              >
                이전
              </button>
              <button
                type="button"
                onClick={() => setStep('complete')}
                className="rounded-lg bg-gray-900 px-4 py-2 text-white"
              >
                예약하기
              </button>
            </div>
          </div>
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
