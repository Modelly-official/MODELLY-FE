'use client';

import { useState } from 'react';
import { useSignupStore } from '@/src/stores';
import { SignupHeader, SignupTitle, FixedBottomButton } from '@/src/components/signup';
import { SIGNUP_ROLES, SIGNUP_STEPS, SIGNUP_MESSAGES } from '@/src/constants/signup';
import type { SignupStepProps } from '@/src/types';

interface StepRoleProps extends Omit<SignupStepProps, 'goPrev'> {
  goPrev: () => void;
}

export const StepRole: React.FC<StepRoleProps> = ({ goNext, goPrev, isSocial }) => {
  const { role, setField } = useSignupStore();
  const [selectedRole, setSelectedRole] = useState<string | null>(role || null);
  const totalSteps = isSocial ? SIGNUP_STEPS.SOCIAL : SIGNUP_STEPS.REGULAR;

  return (
    <div className="flex min-h-screen flex-col">
      <SignupHeader onBack={goPrev} totalSteps={totalSteps} currentStep={2} />
      <SignupTitle line1={SIGNUP_MESSAGES.ROLE.TITLE_1} line2={SIGNUP_MESSAGES.ROLE.TITLE_2} />
      <div className="mx-4 mt-8 flex w-[calc(100%-2rem)] flex-row justify-center gap-3 sm:w-[343px]">
        {SIGNUP_ROLES.map((role) => (
          <button
            key={role.key}
            type="button"
            className={`text-body-1-semibold flex h-[166px] w-[166px] cursor-pointer items-center justify-center rounded-xl border py-5 tracking-tight transition-all ${
              selectedRole === role.key
                ? 'border-none bg-purple-500 text-white'
                : 'border-none bg-gray-100 text-gray-600'
            }`}
            onClick={() => setSelectedRole(role.key)}
          >
            {role.label}
          </button>
        ))}
      </div>
      <div className="mx-4 mt-auto mb-[42px]">
        <FixedBottomButton
          disabled={!selectedRole}
          onClick={() => {
            if (selectedRole) {
              setField('role', selectedRole);
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
