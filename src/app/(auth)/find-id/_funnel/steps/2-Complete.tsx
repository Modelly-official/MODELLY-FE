'use client';

import { useRouter } from 'next/navigation';
import SignupCompletedIcon from '@/public/icons/signup/signup-completed.svg';
import { FixedBottomContainer } from '@/src/components/common/FixedBottomContainer';
import { getSocialServiceName } from '@/src/utils/auth/common';

interface StepCompleteProps {
  name: string;
  loginId: string;
  loginType: string;
}

export const StepComplete: React.FC<StepCompleteProps> = ({ name, loginId, loginType }) => {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push('/login');
  };

  // 소셜 로그인 여부 확인 (loginId가 null이거나 loginType이 JWT가 아닌 경우)
  const isSocialLogin = loginType !== 'JWT' && (loginId === null || loginId === 'null' || !loginId);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="mb-[84px] flex flex-col items-center gap-5">
        <div className="relative h-[50px] w-[50px]">
          <SignupCompletedIcon />
        </div>
        <div className="flex flex-col items-center gap-1">
          {isSocialLogin ? (
            <>
              <p className="text-head-3-medium text-center tracking-tight">{name} 님은</p>
              <div className="flex items-baseline gap-1">
                <span className="text-head-3-semibold tracking-tight">
                  {getSocialServiceName(loginType)} 소셜 로그인 사용자
                </span>
                <span className="text-head-3-semibold tracking-tight">입니다</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-head-3-medium text-center tracking-tight">{name} 님의 아이디는</p>
              <div className="flex items-baseline gap-1">
                <span className="text-head-2-semibold tracking-tight">{loginId}</span>
                <span className="text-head-3-medium tracking-tight">입니다</span>
              </div>
            </>
          )}
        </div>
      </div>
      <FixedBottomContainer>
        <button
          onClick={handleGoToLogin}
          className="text-body-1-semibold h-[56px] w-full cursor-pointer rounded-full bg-gray-900 text-white"
        >
          로그인 화면으로 이동
        </button>
      </FixedBottomContainer>
    </div>
  );
};
