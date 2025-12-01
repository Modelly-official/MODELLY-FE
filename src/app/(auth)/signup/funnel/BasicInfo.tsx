"use client";

import { useState } from "react";
import LeftArrowIcon from "@/public/icons/signup/leftarrow.svg";
import BasicInfoInput from "@/src/components/signup/BasicInfoInput";
import PhoneInputWithAuth from "@/src/components/signup/PhoneInputWithAuth";
import AuthCodeInput from "@/src/components/signup/AuthCodeInput";
import SignupProgressBar from "@/src/components/signup/SignupProgressBar";
import { useSignupStore } from "@/src/stores/useSignupStore";

interface StepBasicInfoProps {
  goPrev: () => void;
  goNext: () => void;
  isSocial: boolean;
}

export default function StepBasicInfo({ goPrev, goNext, isSocial }: StepBasicInfoProps) {
  const { name, phoneNumber, email, setField } = useSignupStore();
  const [authCode, setAuthCode] = useState("");
  const [authCodeError, setAuthCodeError] = useState("");
  const [authCodeValid, setAuthCodeValid] = useState<boolean | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const handleRequestPhoneAuth = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setAuthCodeError("올바른 전화번호를 입력해주세요.");
      return;
    }
    setRequestSent(true);
    setAuthCode("");
    setAuthCodeValid(null);
    setAuthCodeError("");
    setShowResend(false);
  };

  const handleVerifyAuthCode = () => {
    if (authCode === "1234") {
      setAuthCodeValid(true);
      setAuthCodeError("");
    } else {
      setAuthCodeValid(false);
      setAuthCodeError("인증번호가 일치하지 않습니다.");
    }
  };

  if (isSocial) return null;

  return (
    <>
      <div className="mt-15 mx-4">
        <button type="button" onClick={goPrev} className="w-6 h-6 flex items-center justify-center">
          <LeftArrowIcon />
        </button>
        <SignupProgressBar totalSteps={5} currentStep={3} />
      </div>
      <div className="mt-12 ml-4">
        <p className="text-black text-head-3-semibold tracking-tight mb-0">반가워요!</p>
        <p className="text-black text-head-3-semibold tracking-tight mb-0">기본 정보를 입력해주세요</p>
      </div>
      <form className="flex flex-col gap-6 mt-10 mx-4 w-[343px]" onSubmit={e => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <BasicInfoInput name={name} email={email || ""} setField={setField} />
          <PhoneInputWithAuth
            phoneNumber={phoneNumber}
            setField={setField}
            handleRequestPhoneAuth={handleRequestPhoneAuth}
            requestSent={requestSent}
            showResend={showResend}
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
        <button
          type="button"
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-[343px] mb-13 py-4 rounded-full flex items-center justify-center text-body-1-semibold tracking-tight ${name && email && phoneNumber && authCodeValid ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}
          disabled={!name || !email || !phoneNumber || !authCodeValid}
          onClick={goNext}
        >
          다음
        </button>
      </form>
    </>
  );
}