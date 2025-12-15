import React, { useState } from "react";

import { SignupStoreField } from "@/src/stores/useSignupStore";
import { checkEmail } from "@/src/apis";

interface BasicInfoInputProps {
  name: string;
  email: string;
  setField: (field: SignupStoreField, value: string) => void;
}

export const BasicInfoInput: React.FC<BasicInfoInputProps> = ({ name, email, setField }) => {
  const [emailStatus, setEmailStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [emailMessage, setEmailMessage] = useState("");

  // 이메일 유효성 검증
  const isValidEmailFormat = (email: string) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 중복 체크
  const handleCheckEmail = async () => {
    if (!isValidEmailFormat(email)) {
      setEmailStatus("invalid");
      setEmailMessage("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setEmailStatus("checking");
    try {
      const response = await checkEmail(email);
      if (response.isSuccess) {
        setEmailStatus("valid");
        setEmailMessage("사용 가능한 이메일입니다.");
      } else {
        setEmailStatus("invalid");
        setEmailMessage(response.message || "이미 사용 중인 이메일입니다.");
      }
    } catch (error) {
      setEmailStatus("invalid");
      setEmailMessage("이메일 확인 중 오류가 발생했습니다.");
      console.error("이메일 중복 체크 에러:", error);
    }
  };

  const handleEmailChange = (value: string) => {
    setField("email", value);
    setEmailStatus("idle");
    setEmailMessage("");
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-gray-900 text-body-1-medium">이름 (실명)</label>
        <input
          type="text"
          className="border border-gray-400 rounded-xl px-4 py-3 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("name", e.target.value)}
          maxLength={20}
        />
      </div>
      <div className="flex flex-col gap-2 mt-6 mb-6">
        <label className="text-gray-900 text-body-1-medium">이메일</label>
        <div className="flex gap-2 items-center">
          <input
            type="email"
            className={`flex-1 border ${
              emailStatus === "invalid" ? "border-error" : "border-gray-400"
            } rounded-xl px-4 py-3 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none`}
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEmailChange(e.target.value)}
            maxLength={50}
            autoComplete="off"
          />
          <button
            type="button"
            className={`w-20 rounded-xl px-4 py-3.5 cursor-pointer text-body-2-medium ${
              email && isValidEmailFormat(email)
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={handleCheckEmail}
            disabled={!email || !isValidEmailFormat(email) || emailStatus === "checking"}
          >
            {emailStatus === "checking" ? "확인중" : "중복확인"}
          </button>
        </div>
        {emailStatus === "valid" && (
          <p className="text-caption-1 text-blue-700">{emailMessage}</p>
        )}
        {emailStatus === "invalid" && (
          <p className="text-caption-1 text-error">{emailMessage}</p>
        )}
      </div>
    </>
  );
};
