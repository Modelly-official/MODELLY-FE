'use client';

import { useRouter } from 'next/navigation';
import { useReservationStore } from '@/src/stores/reservation/useReservationStore';
import SignupCompletedIcon from '@/public/icons/signup/signup-completed.svg';

export default function StepComplete() {
  const router = useRouter();
  const { reset } = useReservationStore();

  const handleConfirm = () => {
    reset();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="mb-[84px] flex flex-col items-center gap-5">
        <div className="relative h-[50px] w-[50px]">
          <SignupCompletedIcon />
        </div>
        <p className="text-head-3-semibold text-center text-gray-900">
          예약 신청이 완료되었습니다
        </p>
      </div>
      <button
        type="button"
        onClick={handleConfirm}
        className="text-body-1-medium fixed bottom-[calc(12px+env(safe-area-inset-bottom))] left-1/2 w-[calc(100%-2rem)] max-w-[343px] -translate-x-1/2 cursor-pointer rounded-full bg-gray-900 py-4 text-white"
      >
        확인
      </button>
    </div>
  );
}
