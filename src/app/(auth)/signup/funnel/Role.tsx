"use client";

import React, { useState } from "react";
import LeftArrowIcon from "@/public/icons/signup/leftarrow.svg";
import { useSignupStore } from "@/src/stores/useSignupStore";
import SignupProgressBar from "@/src/components/signup/SignupProgressBar";

interface StepRoleProps {
  goNext: () => void;
  goPrev: () => void;
  isSocial: boolean;
}

export default function StepRole({ goNext, goPrev, isSocial }: StepRoleProps) {
  const { setField } = useSignupStore();
  const roles = [
    { key: "designer", label: "디자이너" },
    { key: "model", label: "모델" },
  ];
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const totalSteps = isSocial ? 3 : 5;

  return (
    <>
      <div className="mt-15 mx-4">
        <button type="button" onClick={goPrev} className="w-6 h-6 flex items-center justify-center">
          <LeftArrowIcon />
        </button>
        <SignupProgressBar totalSteps={totalSteps} currentStep={2} />
      </div>
      <div className="mt-12 ml-4">
        <p className="text-black text-head-3-semibold tracking-tight mb-0">어떤 역할로</p>
        <p className="text-black text-head-3-semibold tracking-tight mb-0">Modelly를 이용하시겠어요?</p>
      </div>
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
      <button
        type="button"
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-[343px] mb-13 py-4 rounded-full flex items-center justify-center text-body-1-semibold tracking-tight ${selectedRole ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}
        disabled={!selectedRole}
        onClick={() => {
          if (selectedRole) {
            setField("role", selectedRole);
            goNext();
          }
        }}
      >
        다음
      </button>
    </>
  );
}
