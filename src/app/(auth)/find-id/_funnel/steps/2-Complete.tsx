'use client';

import { useRouter } from 'next/navigation';
import SignupCompletedIcon from '@/public/icons/signup/signup-completed.svg';

interface StepCompleteProps {
  name: string;
  loginId: string;
}

export const StepComplete: React.FC<StepCompleteProps> = ({ name, loginId }) => {
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
            {name} 님의 아이디는
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-gray-900 text-head-2-semibold tracking-tight">{loginId}</span>
            <span className="text-gray-900 text-head-3-semibold tracking-tight">입니다</span>
          </div>
        </div>
      </div>
      <button
        onClick={handleGoToLogin}
        className="fixed bottom-[42px] left-1/2 -translate-x-1/2 w-[343px] py-4 bg-gray-900 text-white rounded-full text-body-1-semibold cursor-pointer tracking-tight"
      >
        로그인 화면으로 이동
      </button>
    </div>
  );
};

