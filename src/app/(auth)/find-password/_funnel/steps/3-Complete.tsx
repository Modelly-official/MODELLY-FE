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
      <button
        onClick={handleGoToLogin}
        className="text-body-1-medium fixed bottom-[calc(20px+env(safe-area-inset-bottom))] left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 cursor-pointer rounded-full bg-gray-900 py-4 tracking-tight text-white sm:w-[343px]"
      >
        로그인 화면으로 이동
      </button>
    </div>
  );
};
