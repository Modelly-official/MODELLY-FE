'use client';

import { useRouter } from 'next/navigation';
import SignupCompletedIcon from '@/public/icons/signup/signup-completed.svg';
import { FixedBottomContainer } from '@/src/components/common/FixedBottomContainer';
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
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="mb-[84px] flex flex-col items-center gap-5">
        <div className="relative h-[50px] w-[50px]">
          <SignupCompletedIcon />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-head-3-medium text-center tracking-tight">{name} 님은</p>
          <div className="flex items-baseline gap-1">
            <span className="text-head-2-semibold tracking-tight">{serviceName} 소셜 로그인 사용자</span>
            <span className="text-head-3-medium tracking-tight">입니다</span>
          </div>
          <p className="text-body-1-medium mt-4 text-center tracking-tight text-gray-700">
            해당 서비스로 로그인해주세요
          </p>
        </div>
      </div>
      <FixedBottomContainer>
        <button
          onClick={handleGoToLogin}
          className="text-body-1-semibold h-14 w-full cursor-pointer rounded-full bg-gray-900 text-white"
        >
          로그인 화면으로 이동
        </button>
      </FixedBottomContainer>
    </div>
  );
};
