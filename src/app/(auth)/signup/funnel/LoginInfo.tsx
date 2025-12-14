"use client";

import SignupHeader from "@/src/components/signup/SignupHeader";
import PasswordInput from "@/src/components/signup/PasswordInput";
import { useSignupStore } from "@/src/stores/useSignupStore";
import { usernameSchema, passwordSchema } from "@/src/schemas/signupSchema";

interface StepLoginInfoProps {
  goPrev: () => void;
  goNext: () => void;
  isSocial: boolean;
}

export default function StepLoginInfo({ goPrev, goNext, isSocial }: StepLoginInfoProps) {
  const { 
    username, 
    password, 
    passwordConfirm,
    isUsernameAvailable,
    passwordError,
    passwordConfirmError,
    setField,
    setIsUsernameAvailable,
    setPasswordError,
    setPasswordConfirmError,
  } = useSignupStore();

  // 아이디 중복 확인(API 연동 전)
  const checkUsername = () => {
    // 아이디 유효성 검증
    const result = usernameSchema.safeParse(username);
    if (!result.success) {
      setIsUsernameAvailable(false);
      return;
    }
    setIsUsernameAvailable(true);
  };

  // 영어, 숫자만 입력 가능하도록 필터링
  const handleUsernameChange = (value: string) => {
    const filteredValue = value.replace(/[^a-z0-9]/g, "");
    setField("username", filteredValue);
    setIsUsernameAvailable(null);
  };

  // 비밀번호 유효성 검증
  const validatePassword = (pwd: string) => {
    if (!pwd) return null;
    const result = passwordSchema.safeParse(pwd);
    if (result.success) {
      return "success";
    }
    return "error";
  };

  // 비밀번호 확인 검증
  const validatePasswordConfirm = (confirm: string) => {
    if (!confirm) return null;
    if (confirm !== password) {
      return "error";
    }
    return "success";
  };

  const handlePasswordChange = (value: string) => {
    setField("password", value);
    setPasswordError(validatePassword(value));
    if (passwordConfirm) {
      setPasswordConfirmError(validatePasswordConfirm(passwordConfirm));
    }
  };

  const handlePasswordConfirmChange = (value: string) => {
    setField("passwordConfirm", value);
    setPasswordConfirmError(validatePasswordConfirm(value));
  };

  const isFormValid = 
    username && 
    isUsernameAvailable && 
    password && 
    passwordError === "success" && 
    passwordConfirm && 
    passwordConfirmError === "success";

  if (isSocial) return null;

  return (
    <>
      <SignupHeader onBack={goPrev} totalSteps={5} currentStep={4} />
      <div className="mt-12 ml-4">
        <p className="text-black text-head-3-semibold tracking-tight mb-0">로그인에 사용할</p>
        <p className="text-black text-head-3-semibold tracking-tight mb-0">정보를 입력해주세요</p>
      </div>
      <form className="flex flex-col gap-6 mt-10 mx-4 w-[343px]" onSubmit={e => e.preventDefault()}>
        <div className="flex flex-col gap-6">
          {/* 아이디 */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-900 text-body-1-medium">아이디</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                className="flex-1 border border-gray-400 rounded-xl px-4 py-3 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none"
                placeholder="아이디를 입력해주세요"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                maxLength={20}
              />
              <button
                type="button"
                className={`w-20 rounded-xl px-4 py-3.5 cursor-pointer text-body-2-medium ${
                  username && username.length >= 1
                    ? "bg-blue-200 text-blue-700"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={checkUsername}
                disabled={!username || username.length < 1}
              >
                중복확인
              </button>
            </div>
            {isUsernameAvailable === true && (
              <p className="text-caption-1 text-blue-700">사용 가능한 아이디입니다.</p>
            )}
            {isUsernameAvailable === false && (
              <p className="text-caption-1 text-error">이미 사용 중인 아이디입니다.</p>
            )}
          </div>

          {/* 비밀번호 */}
          <PasswordInput
            label="비밀번호"
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
            hintMessage="영문 대소문자, 숫자, 특수문자(~!@#^*) 조합 8자 이상이어야 합니다."
            errorMessage="영문 대소문자, 숫자, 특수문자(~!@#^*) 조합 8자 이상이어야 합니다."
            successMessage="사용 가능한 비밀번호입니다."
          />

          {/* 비밀번호 확인 */}
          <PasswordInput
            label="비밀번호 확인"
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            error={passwordConfirmError}
            errorMessage="비밀번호가 일치하지 않습니다."
            successMessage="비밀번호가 일치합니다."
          />
        </div>

        <button
          type="button"
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-[343px] mb-13 py-4 cursor-pointer rounded-full flex items-center justify-center text-body-1-semibold tracking-tight ${
            isFormValid ? "bg-black text-white" : "bg-gray-200 text-gray-600"
          }`}
          disabled={!isFormValid}
          onClick={goNext}
        >
          다음
        </button>
      </form>
    </>
  );
}
