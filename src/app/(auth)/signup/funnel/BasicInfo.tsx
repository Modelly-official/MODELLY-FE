"use client";

import { useState } from "react";
import BasicInfoInput from "@/src/components/signup/BasicInfoInput";
import PhoneInputWithAuth from "@/src/components/signup/PhoneInputWithAuth";
import AuthCodeInput from "@/src/components/signup/AuthCodeInput";
import SignupHeader from "@/src/components/signup/SignupHeader";
import SignupTitle from "@/src/components/signup/SignupTitle";
import FixedBottomButton from "@/src/components/signup/FixedBottomButton";
import { useSignupStore } from "@/src/stores/useSignupStore";
import { validatePhoneNumber, verifyAuthCode } from "@/src/utils/validation";
import { SIGNUP_STEPS, SIGNUP_MESSAGES } from "@/src/constants/signup";
import type { SignupStepProps } from "@/src/types/signup";

interface StepBasicInfoProps extends SignupStepProps {
  goPrev: () => void;
}

const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ goPrev, goNext, isSocial }) => {
  const { name, phoneNumber, email, setField } = useSignupStore();
  const [authCode, setAuthCode] = useState("");
  const [authCodeError, setAuthCodeError] = useState("");
  const [authCodeValid, setAuthCodeValid] = useState<boolean | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  const handleRequestPhoneAuth = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setAuthCodeError("올바른 전화번호를 입력해주세요.");
      return;
    }
    // TODO: API 연동 시 실제 인증번호 발송 로직으로 교체
    setRequestSent(true);
    setAuthCode("");
    setAuthCodeValid(null);
    setAuthCodeError("");
  };

  const handleVerifyAuthCode = () => {
    // TODO: API 연동 시 실제 인증번호 검증 로직으로 교체
    const isValid = verifyAuthCode(authCode);
    setAuthCodeValid(isValid);
    setAuthCodeError(isValid ? "" : "인증번호가 일치하지 않습니다.");
  };

  if (isSocial) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <SignupHeader onBack={goPrev} totalSteps={SIGNUP_STEPS.REGULAR} currentStep={3} />
      <SignupTitle line1={SIGNUP_MESSAGES.BASIC_INFO.TITLE_1} line2={SIGNUP_MESSAGES.BASIC_INFO.TITLE_2} />
      <form className="flex flex-col gap-6 mt-10 mx-4 w-[343px] flex-1" onSubmit={e => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <BasicInfoInput name={name} email={email || ""} setField={setField} />
          <PhoneInputWithAuth
            phoneNumber={phoneNumber}
            setField={setField}
            handleRequestPhoneAuth={handleRequestPhoneAuth}
            requestSent={requestSent}
          />
          <AuthCodeInput
            authCode={authCode}
            setAuthCode={setAuthCode}
            handleVerifyAuthCode={handleVerifyAuthCode}
            authCodeError={authCodeError}
            authCodeValid={authCodeValid}
            requestSent={requestSent}
          />
        </div>
        <div className="mt-auto mb-[42px]">
          <FixedBottomButton
            disabled={!name || !email || !phoneNumber || !authCodeValid}
            onClick={goNext}
          >
            {SIGNUP_MESSAGES.BUTTON.NEXT}
          </FixedBottomButton>
        </div>
      </form>
    </div>
  );
};

export default StepBasicInfo;