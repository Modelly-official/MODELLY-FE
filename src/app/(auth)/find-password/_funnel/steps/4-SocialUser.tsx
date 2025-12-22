'use client';

import { useRouter } from 'next/navigation';
import SignupCompletedIcon from '@/public/icons/signup/signup-completed.svg';
import { getSocialServiceName } from '@/src/utils/auth/common';

interface StepSocialUserProps {
  name: string;
  loginType: string;
}

export const StepSocialUser: React.FC<StepSocialUserProps> = ({ name, loginType }) => {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push('/login');
  };

  const serviceName = getSocialServiceName(loginType);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="flex flex-col items-center gap-5 mb-[84px]">
        <div className="relative w-[50px] h-[50px]">
          <SignupCompletedIcon />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-head-3-medium text-center tracking-tight">{name} 님은</p>
          <div className="flex items-baseline gap-1">
            <span className="text-head-2-semibold tracking-tight">{serviceName} 소셜 로그인 사용자</span>
            <span className="text-head-3-medium tracking-tight">입니다</span>
          </div>
          <p className="text-body-1-medium text-gray-700 text-center tracking-tight mt-4">
            해당 서비스로 로그인해주세요
          </p>
        </div>
      </div>
      <button
        onClick={handleGoToLogin}
        className="fixed bottom-[42px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-[343px] py-4 bg-gray-900 text-white rounded-full text-body-1-medium cursor-pointer tracking-tight"
      >
        로그인 화면으로 이동
      </button>
    </div>
  );
};
