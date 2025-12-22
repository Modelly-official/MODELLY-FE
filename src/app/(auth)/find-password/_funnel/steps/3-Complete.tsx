'use client';

import { useRouter } from 'next/navigation';
import SignupCompletedIcon from '@/public/icons/signup/signup-completed.svg';

export const StepComplete: React.FC = () => {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="flex flex-col items-center gap-5 mb-[84px]">
        <div className="relative w-[50px] h-[50px]">
          <SignupCompletedIcon />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-gray-900 text-head-3-semibold text-center tracking-tight">
            비밀번호 변경이 완료되었어요
          </p>
        </div>
      </div>
      <button
        onClick={handleGoToLogin}
        className="fixed bottom-[42px] left-1/2 -translate-x-1/2 w-[343px] py-4 bg-gray-900 text-white rounded-full text-body-1-medium cursor-pointer tracking-tight"
      >
        로그인 화면으로 이동
      </button>
    </div>
  );
};

