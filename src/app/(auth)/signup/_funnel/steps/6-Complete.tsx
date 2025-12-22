'use client';

import { useRouter } from 'next/navigation';
import { SIGNUP_MESSAGES } from '@/src/constants/signup';
import SignupCompletedIcon from '@/public/icons/signup/signup-completed.svg';

export const StepComplete: React.FC = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="flex flex-col items-center gap-5 mb-[84px]">
        <div className="relative w-[50px] h-[50px]">
          <SignupCompletedIcon />
        </div>
        <p className="text-gray-900 text-head-3-semibold text-center whitespace-pre-wrap">
          {SIGNUP_MESSAGES.COMPLETE.TITLE}
        </p>
      </div>
      <button
        onClick={handleStart}
        className="fixed bottom-[42px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-[343px] max-w-[343px] py-4 bg-gray-900 text-white rounded-full text-body-1-medium cursor-pointer"
      >
        {SIGNUP_MESSAGES.COMPLETE.BUTTON}
      </button>
    </div>
  );
};
