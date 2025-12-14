import React from "react";

import { SignupStoreField } from "../../stores/useSignupStore";
interface PhoneInputWithAuthProps {
  phoneNumber: string;
  setField: (field: SignupStoreField, value: string) => void;
  handleRequestPhoneAuth: () => void;
  requestSent: boolean;
}

function formatPhone(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0,3)}-${digits.slice(3)}`;
  return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7,11)}`;
}

export default function PhoneInputWithAuth({ phoneNumber, setField, handleRequestPhoneAuth, requestSent }: PhoneInputWithAuthProps) {
  const isValidPhone = /^\d{3}-\d{4}-\d{4}$/.test(phoneNumber);
  
  let buttonText = "인증하기";
  if (isValidPhone && !requestSent) {
    buttonText = "인증요청";
  } else if (requestSent) {
    buttonText = "재발송";
  }
  
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-900 text-body-1-medium">전화번호</label>
      <div className="flex gap-2 items-center min-w-0">
        <input
          type="tel"
          className={`flex-1 border border-gray-400 rounded-xl px-4 py-3 text-body-2-medium placeholder:text-gray-600 focus:outline-none ${
            requestSent ? "bg-gray-100 text-gray-700" : "bg-white text-gray-900"
          }`}
          placeholder="휴대폰 번호 (숫자만 입력)"
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("phoneNumber", formatPhone(e.target.value))}
          maxLength={13}
          autoComplete="off"
          disabled={requestSent}
        />
        <button
          type="button"
          className={`w-20 rounded-xl px-4 py-3.5 text-body-2-medium cursor-pointer ${
            requestSent
              ? "bg-white text-blue-700 border border-blue-400"
              : isValidPhone
              ? "bg-blue-200 text-blue-700"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={handleRequestPhoneAuth}
          disabled={!isValidPhone && !requestSent}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
