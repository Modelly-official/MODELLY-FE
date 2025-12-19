"use client";

import {
  SignupHeader,
  SignupTitle,
  FixedBottomButton,
  PasswordInput,
} from "@/src/components/signup";
import { useSignupStore } from "@/src/stores";
import { useCheckLoginId } from "@/src/hooks/queries";
import { usernameSchema, passwordSchema } from "@/src/schemas/signupSchema";
import { validateField, validateMatch, formatLoginId } from "@/src/utils";
import { SIGNUP_STEPS, SIGNUP_MESSAGES } from "@/src/constants/signup";
import type { SignupStepProps } from "@/src/types";

interface StepLoginInfoProps extends SignupStepProps {
  goPrev: () => void;
}

export const StepLoginInfo: React.FC<StepLoginInfoProps> = ({
  goPrev,
  goNext,
  isSocial,
}) => {
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

  const checkLoginIdMutation = useCheckLoginId();

  // 아이디 중복 확인
  const checkUsername = () => {
    const fieldValidation = validateField(usernameSchema, username);
    if (fieldValidation !== "success") {
      setIsUsernameAvailable(false);
      return;
    }

    checkLoginIdMutation.mutate(username, {
      onSuccess: (response) => {
        if (response.isSuccess && response.result.available) {
          setIsUsernameAvailable(true);
        } else {
          setIsUsernameAvailable(false);
        }
      },
      onError: (error) => {
        setIsUsernameAvailable(false);
        console.error("아이디 중복 체크 에러:", error);
      },
    });
  };

  // 아이디 입력 처리 (영어 소문자, 숫자만)
  const handleUsernameChange = (value: string) => {
    setField("username", formatLoginId(value));
    setIsUsernameAvailable(null);
  };

  // 비밀번호 입력 처리
  const handlePasswordChange = (value: string) => {
    setField("password", value);
    setPasswordError(validateField(passwordSchema, value));
    // 비밀번호 확인이 이미 입력되어 있으면 다시 검증
    if (passwordConfirm) {
      setPasswordConfirmError(validateMatch(value, passwordConfirm));
    }
  };

  // 비밀번호 확인 입력 처리
  const handlePasswordConfirmChange = (value: string) => {
    setField("passwordConfirm", value);
    setPasswordConfirmError(validateMatch(password, value));
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
    <div className="min-h-screen flex flex-col">
      <SignupHeader
        onBack={goPrev}
        totalSteps={SIGNUP_STEPS.REGULAR}
        currentStep={4}
      />
      <SignupTitle
        line1={SIGNUP_MESSAGES.LOGIN_INFO.TITLE_1}
        line2={SIGNUP_MESSAGES.LOGIN_INFO.TITLE_2}
      />
      <form
        className="flex flex-col gap-6 mt-10 mx-4 w-[343px] flex-1"
        onSubmit={(e) => e.preventDefault()}
      >
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
                className={`w-20 rounded-xl px-4 py-3.5 text-body-2-medium ${
                  username && username.length >= 1
                    ? "bg-blue-200 text-blue-700"
                    : "bg-gray-200 text-gray-600"
                } cursor-pointer`}
                onClick={checkUsername}
                disabled={
                  !username ||
                  username.length < 1 ||
                  checkLoginIdMutation.isPending
                }
              >
                중복확인
              </button>
            </div>
            {isUsernameAvailable === true && (
              <p className="text-caption-1 text-blue-700">
                사용 가능한 아이디입니다.
              </p>
            )}
            {isUsernameAvailable === false && (
              <p className="text-caption-1 text-error">
                이미 사용 중인 아이디입니다.
              </p>
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

        <div className="mt-auto mb-[42px]">
          <FixedBottomButton disabled={!isFormValid} onClick={goNext}>
            {SIGNUP_MESSAGES.BUTTON.NEXT}
          </FixedBottomButton>
        </div>
      </form>
    </div>
  );
};
