"use client";

import LeftArrowIcon from "@/public/icons/signup/leftarrow.svg";
import SignupProgressBar from "@/src/components/auth/SignupProgressBar";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupRolePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSocial = searchParams.get("social") === "true";
  const totalSteps = isSocial ? 3 : 5;
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    { key: "designer", label: "디자이너" },
    { key: "model", label: "모델" },
  ];

  return (
    <div className="w-[375px] mx-auto bg-white font-sans min-h-screen relative">
      {/* ProgressBar */}
      <div className="mt-15 mx-4">
        <button type="button" onClick={() => window.history.back()} className="w-6 h-6 flex items-center justify-center">
          <LeftArrowIcon />
        </button>
        <SignupProgressBar totalSteps={totalSteps} currentStep={2} />
      </div>
      {/* 제목 */}
      <div className="mt-12 ml-4">
        <p className="text-black text-head-3-semibold tracking-tight mb-0">어떤 역할로</p>
        <p className="text-black text-head-3-semibold tracking-tight mb-0">Modelly를 이용하시겠어요?</p>
      </div>
      {/* 역할 선택 */}
      <div className="flex flex-row justify-between mt-10 mx-4 w-[343px]">
        {roles.map((role) => (
          <button
            key={role.key}
            type="button"
            className={`w-[166px] h-[166px] py-5 rounded-xl border text-body-1-semibold tracking-tight flex items-center justify-center transition-all
              ${selectedRole === role.key ? "bg-blue-100 text-blue-700 border-none" : "bg-gray-100 text-gray-600 border-none"}`}
            onClick={() => setSelectedRole(role.key)}
          >
            {role.label}
          </button>
        ))}
      </div>
      {/* 다음 버튼 */}
      <button
        className={`w-[343px] mx-4 mt-75 py-4 rounded-full flex items-center justify-center text-body-1-semibold tracking-tight ${selectedRole ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}
        disabled={!selectedRole}
        onClick={() => selectedRole && router.push(`/signup/info?role=${selectedRole}${isSocial ? "&social=true" : ""}`)}
      >
        다음
      </button>
    </div>
  );
}