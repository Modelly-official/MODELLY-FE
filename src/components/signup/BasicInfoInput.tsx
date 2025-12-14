import React from "react";

import { SignupStoreField } from "../../stores/useSignupStore";
interface BasicInfoInputProps {
  name: string;
  email: string;
  setField: (field: SignupStoreField, value: string) => void;
}

export default function BasicInfoInput({ name, email, setField }: BasicInfoInputProps) {
  // 이메일 유효성 검증
  const isValidEmail = (email: string) => {
    if (!email) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const emailValid = isValidEmail(email);

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
        <input
          type="email"
          className={`border ${emailValid === false ? "border-error" : "border-gray-400"} rounded-xl px-4 py-3 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none`}
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("email", e.target.value)}
          maxLength={50}
          autoComplete="off"
        />
        {emailValid === true && (
          <p className="text-caption-1 text-blue-700">사용 가능한 이메일입니다.</p>
        )}
        {emailValid === false && (
          <p className="text-caption-1 text-error">사용 불가능한 이메일입니다.</p>
        )}
      </div>
    </>
  );
}
