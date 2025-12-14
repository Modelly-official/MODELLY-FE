"use client";

import { useState } from "react";
import { useSignupStore } from "@/src/stores/useSignupStore";
import SignupHeader from "@/src/components/signup/SignupHeader";
import SignupTitle from "@/src/components/signup/SignupTitle";
import FixedBottomButton from "@/src/components/signup/FixedBottomButton";
import { SIGNUP_ROLES, SIGNUP_STEPS, SIGNUP_MESSAGES } from "@/src/constants/signup";
import type { SignupStepProps } from "@/src/types/signup";

interface StepRoleProps extends Omit<SignupStepProps, 'goPrev'> {
  goPrev: () => void;
}

const StepRole: React.FC<StepRoleProps> = ({ goNext, goPrev, isSocial }) => {
  const { role, setField } = useSignupStore();
  const [selectedRole, setSelectedRole] = useState<string | null>(role || null);
  const totalSteps = isSocial ? SIGNUP_STEPS.SOCIAL : SIGNUP_STEPS.REGULAR;

  return (
    <div className="min-h-screen flex flex-col">
      <SignupHeader onBack={goPrev} totalSteps={totalSteps} currentStep={2} />
      <SignupTitle line1={SIGNUP_MESSAGES.ROLE.TITLE_1} line2={SIGNUP_MESSAGES.ROLE.TITLE_2} />
      <div className="flex flex-row justify-between mt-10 mx-4 w-[343px]">
        {SIGNUP_ROLES.map((role) => (
          <button
            key={role.key}
            type="button"
            className={`w-[166px] h-[166px] py-5 rounded-xl border text-body-1-semibold tracking-tight flex items-center justify-center transition-all cursor-pointer
              ${selectedRole === role.key ? "bg-blue-600 text-white border-none" : "bg-gray-100 text-gray-600 border-none"}`}
            onClick={() => setSelectedRole(role.key)}
          >
            {role.label}
          </button>
        ))}
      </div>
      <div className="mt-auto mb-[42px] mx-4">
        <FixedBottomButton
          disabled={!selectedRole}
          onClick={() => {
            if (selectedRole) {
              setField("role", selectedRole);
              goNext();
            }
          }}
        >
          {SIGNUP_MESSAGES.BUTTON.NEXT}
        </FixedBottomButton>
      </div>
    </div>
  );
};

export default StepRole;
