'use client';

import { useRouter } from 'next/navigation';
import { useSignupStore } from '@/src/stores';
import { SignupHeader, SignupTitle, FixedBottomButton } from '@/src/components/signup';
import { SIGNUP_STEPS, SIGNUP_MESSAGES } from '@/src/constants/signup';
import type { SignupStepProps } from '@/src/types';
import SelectIcon from '@/public/icons/signup/select.svg';
import SelectedIcon from '@/public/icons/signup/selected.svg';
import CheckIcon from '@/public/icons/signup/check.svg';
import CheckedIcon from '@/public/icons/signup/checked.svg';

type StepTermsProps = Omit<SignupStepProps, 'goPrev'>;

export const StepTerms: React.FC<StepTermsProps> = ({ goNext, isSocial }) => {
  const router = useRouter();
  const { terms, setTerms } = useSignupStore();
  const allAgreed = terms.every((term) => term.checked);
  const requiredAgreed = terms.filter((term) => term.label.startsWith('[필수]')).every((term) => term.checked);

  const totalSteps = isSocial ? SIGNUP_STEPS.SOCIAL : SIGNUP_STEPS.REGULAR;

  const handleAllAgree = () => {
    const next = !allAgreed;
    setTerms(terms.map((term) => ({ ...term, checked: next })));
  };
  const handleTermToggle = (idx: number) => {
    setTerms(terms.map((term, i) => (i === idx ? { ...term, checked: !term.checked } : term)));
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white font-sans">
      <SignupHeader onBack={() => router.push('/login')} totalSteps={totalSteps} currentStep={1} />
      <SignupTitle line1={SIGNUP_MESSAGES.TERMS.TITLE_1} line2={SIGNUP_MESSAGES.TERMS.TITLE_2} />
      <div
        className="mx-4 mt-8 flex w-[calc(100%-2rem)] cursor-pointer items-center gap-4 rounded-xl bg-gray-100 p-4 sm:w-[343px]"
        onClick={handleAllAgree}
      >
        {allAgreed ? <SelectedIcon /> : <SelectIcon />}
        <span className="text-body-1-medium tracking-tight text-gray-900">{SIGNUP_MESSAGES.TERMS.ALL_AGREE}</span>
      </div>
      <div className="mx-4 mt-4 flex w-[calc(100%-2rem)] flex-col gap-4 sm:w-[343px]">
        {terms.map((term, idx) => (
          <div
            key={term.label}
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleTermToggle(idx)}
          >
            {term.checked ? <CheckedIcon /> : <CheckIcon />}
            <span className="text-body-2-medium tracking-tight text-gray-900">{term.label}</span>
          </div>
        ))}
      </div>
      <div className="mx-4 mt-auto mb-3">
        <FixedBottomButton disabled={!requiredAgreed} onClick={goNext}>
          {SIGNUP_MESSAGES.BUTTON.NEXT}
        </FixedBottomButton>
      </div>
    </div>
  );
};
