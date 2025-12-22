'use client';

import { useRouter } from 'next/navigation';
import SignupCompletedIcon from '@/public/icons/signup/signup-completed.svg';
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
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="flex flex-col items-center gap-5 mb-[84px]">
        <div className="relative w-[50px] h-[50px]">
          <SignupCompletedIcon />
        </div>
        <div className="flex flex-col items-center gap-1">
          {isSocialLogin ? (
            <>
              <p className="text-head-3-medium text-center tracking-tight">{name} 님은</p>
              <div className="flex items-baseline gap-1">
                <span className="text-head-2-semibold tracking-tight">
                  {getSocialServiceName(loginType)} 소셜 로그인 사용자
                </span>
                <span className="text-head-3-medium tracking-tight">입니다</span>
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
      <button
        onClick={handleGoToLogin}
        className="fixed bottom-[42px] left-1/2 -translate-x-1/2 w-[343px] py-4 bg-gray-900 text-white rounded-full text-body-1-medium cursor-pointer tracking-tight"
      >
        로그인 화면으로 이동
      </button>
    </div>
  );
};
