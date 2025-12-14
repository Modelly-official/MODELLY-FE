"use client";

import { useRouter } from "next/navigation";
import { useSignupStore } from "@/src/stores/useSignupStore";
import SignupHeader from "@/src/components/signup/SignupHeader";
import SelectIcon from "@/public/icons/signup/select.svg";
import SelectedIcon from "@/public/icons/signup/selected.svg";
import CheckIcon from "@/public/icons/signup/check.svg";
import CheckedIcon from "@/public/icons/signup/checked.svg";


interface StepTermsProps {
  goNext: () => void;
  isSocial: boolean;
}

export default function StepTerms({ goNext, isSocial }: StepTermsProps) {

  const router = useRouter();
  const { terms, setTerms } = useSignupStore();
  const allAgreed = terms.every((term) => term.checked);
  const requiredAgreed = terms.filter(term => term.label.startsWith("[필수]")).every(term => term.checked);

  const totalSteps = isSocial ? 3 : 5;

  const handleAllAgree = () => {
    const next = !allAgreed;
    setTerms(terms.map((term) => ({ ...term, checked: next })));
  };
  const handleTermToggle = (idx: number) => {
    setTerms(terms.map((term, i) => i === idx ? { ...term, checked: !term.checked } : term));
  };

  return (
    <div className="w-[375px] mx-auto bg-white font-sans min-h-screen relative">
      <SignupHeader onBack={() => router.push('/login')} totalSteps={totalSteps} currentStep={1} />
      <div className="mt-12 ml-4">
        <p className="text-black text-head-3-semibold tracking-tight mb-0">반가워요! 가입하려면</p>
        <p className="text-black text-head-3-semibold tracking-tight">약관에 동의가 필요해요</p>
      </div>
      <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-4 mt-10 mx-4 w-[343px] cursor-pointer" onClick={handleAllAgree}>
        {allAgreed ? <SelectedIcon /> : <SelectIcon />}
        <span className="text-gray-900 text-body-1-medium tracking-tight">약관 전체 동의</span>
      </div>
      <div className="flex flex-col gap-2 mt-5 mx-4 w-[343px]">
        {terms.map((term, idx) => (
          <div key={term.label} className="flex items-center gap-2 cursor-pointer" onClick={() => handleTermToggle(idx)}>
            {term.checked ? <CheckedIcon /> : <CheckIcon />}
            <span className="text-gray-900 text-body-2-medium tracking-tight">{term.label}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-[343px] mb-13 py-4 cursor-pointer rounded-full flex items-center justify-center text-body-1-semibold tracking-tight ${requiredAgreed ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}
        disabled={!requiredAgreed}
        onClick={goNext}
      >
        다음
      </button>
    </div>
  );
}