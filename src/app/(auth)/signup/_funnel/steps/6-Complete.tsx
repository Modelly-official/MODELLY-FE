'use client';

import { useRouter } from 'next/navigation';
import { SIGNUP_MESSAGES } from '@/src/constants/signup';
import SignupCompletedIcon from '@/public/icons/signup/signup-completed.svg';
import { FixedBottomContainer } from '@/src/components/common/FixedBottomContainer';

export const StepComplete: React.FC = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="mb-[84px] flex flex-col items-center gap-5">
        <div className="relative h-[50px] w-[50px]">
          <SignupCompletedIcon />
        </div>
        <p className="text-head-3-semibold text-center whitespace-pre-wrap text-gray-900">
          {SIGNUP_MESSAGES.COMPLETE.TITLE}
        </p>
      </div>
      <FixedBottomContainer>
        <button
          onClick={handleStart}
          className="text-body-1-semibold h-14 w-full cursor-pointer rounded-full bg-gray-900 text-white"
        >
          {SIGNUP_MESSAGES.COMPLETE.BUTTON}
        </button>
      </FixedBottomContainer>
    </div>
  );
};
