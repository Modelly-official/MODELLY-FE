'use client';

import { useRouter } from 'next/navigation';
import SignupCompletedIcon from '@/public/icons/signup/signup-completed.svg';

export const StepComplete: React.FC = () => {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="mb-[84px] flex flex-col items-center gap-5">
        <div className="relative h-[50px] w-[50px]">
          <SignupCompletedIcon />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-head-3-semibold text-center tracking-tight text-gray-900">비밀번호 변경이 완료되었어요</p>
        </div>
      </div>
      <div className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 bg-white px-4 pt-3 pb-[calc(4px+env(safe-area-inset-bottom))] sm:w-[375px]">
        <button
          onClick={handleGoToLogin}
          className="text-body-1-semibold h-14 w-full cursor-pointer rounded-full bg-gray-900 text-white"
        >
          로그인 화면으로 이동
        </button>
      </div>
    </div>
  );
};
