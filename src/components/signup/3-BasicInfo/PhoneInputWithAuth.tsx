import React from 'react';

import { SignupStoreField } from '@/src/stores';

interface PhoneInputWithAuthProps {
  phoneNumber: string;
  setField: (field: SignupStoreField, value: string) => void;
  handleRequestPhoneAuth: () => void;
  requestSent: boolean;
  isLoading?: boolean;
}

function formatPhone(value: string) {
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export const PhoneInputWithAuth: React.FC<PhoneInputWithAuthProps> = ({
  phoneNumber,
  setField,
  handleRequestPhoneAuth,
  requestSent,
  isLoading = false,
}) => {
  const isValidPhone = /^\d{3}-\d{4}-\d{4}$/.test(phoneNumber);

  let buttonText = '인증하기';
  if (isValidPhone && !requestSent) {
    buttonText = '인증요청';
  } else if (requestSent) {
    buttonText = '재발송';
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-body-1-medium text-gray-900">전화번호</label>
      <div className="flex min-w-0 items-center gap-2">
        <input
          type="tel"
          className={`text-body-2-medium min-w-0 flex-1 rounded-xl bg-gray-100 px-4 py-[14px] placeholder:text-gray-600 focus:placeholder:text-transparent focus:outline-none ${
            requestSent ? 'text-gray-700' : 'text-gray-900'
          }`}
          placeholder="휴대폰 번호 (숫자만 입력)"
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField('phoneNumber', formatPhone(e.target.value))}
          maxLength={13}
          autoComplete="off"
          disabled={requestSent}
        />
        <button
          type="button"
          className={`text-body-2-medium w-20 shrink-0 rounded-xl px-4 py-[14px] ${
            requestSent
              ? 'border border-purple-400 bg-white text-purple-700'
              : isValidPhone
                ? 'bg-purple-200 text-purple-700'
                : 'bg-gray-200 text-gray-600'
          } cursor-pointer`}
          onClick={handleRequestPhoneAuth}
          disabled={(!isValidPhone && !requestSent) || isLoading}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
