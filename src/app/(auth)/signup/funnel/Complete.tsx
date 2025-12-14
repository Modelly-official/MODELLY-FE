"use client";

import { useRouter } from "next/navigation";
import SignupCompletedIcon from "@/public/icons/signup/signup-completed.svg";

export default function StepComplete() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="flex flex-col items-center gap-5 mb-[84px]">
        <div className="relative w-[50px] h-[50px]">
          <SignupCompletedIcon />
        </div>
        <p className="text-gray-900 text-head-3-semibold text-center whitespace-pre-wrap">
          회원가입이 완료되었어요!
        </p>
      </div>
      <button
        onClick={handleStart}
        className="fixed bottom-[42px] left-1/2 -translate-x-1/2 w-[343px] py-4 bg-[#2f2e32] text-white rounded-full text-body-1-medium cursor-pointer"
      >
        시작하기
      </button>
    </div>
  );
}
