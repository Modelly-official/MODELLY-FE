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
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="mb-[84px] flex flex-col items-center gap-5">
        <div className="relative h-[50px] w-[50px]">
          <SignupCompletedIcon />
        </div>
        <p className="text-head-3-semibold text-center whitespace-pre-wrap text-gray-900">
          {SIGNUP_MESSAGES.COMPLETE.TITLE}
        </p>
      </div>
      <button
        onClick={handleStart}
        className="text-body-1-medium fixed bottom-3 left-1/2 w-[calc(100%-2rem)] max-w-[343px] -translate-x-1/2 cursor-pointer rounded-full bg-gray-900 py-4 text-white sm:w-[343px]"
      >
        {SIGNUP_MESSAGES.COMPLETE.BUTTON}
      </button>
    </div>
  );
};
