import React from 'react';
import { formatTimerDisplay } from '@/src/utils/auth/find-id';

interface AuthCodeInputProps {
  authCode: string;
  setAuthCode: (value: string) => void;
  handleVerifyAuthCode: () => void;
  authCodeError: string;
  authCodeValid: boolean | null;
  requestSent: boolean;
  timer?: number;
}

export const AuthCodeInput: React.FC<AuthCodeInputProps> = ({
  authCode,
  setAuthCode,
  handleVerifyAuthCode,
  authCodeError,
  authCodeValid,
  requestSent,
  timer = 0,
}) => {
  if (!requestSent) return null;
  return (
    <div className="flex flex-col">
      <div className="flex min-w-0 items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            className={`w-full bg-gray-100 ${authCodeValid === false ? 'ring-error ring-1' : ''} text-body-2-medium rounded-xl px-4 py-3.5 text-gray-900 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent disabled:text-gray-700`}
            placeholder="인증번호 입력"
            value={authCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthCode(e.target.value)}
            maxLength={6}
            autoComplete="off"
            disabled={authCodeValid === true}
          />
          {timer > 0 && !authCodeValid && (
            <span className="text-caption-1-medium absolute top-1/2 right-4 -translate-y-1/2 text-gray-700">
              {formatTimerDisplay(timer)}
            </span>
          )}
        </div>
        <button
          type="button"
          className={`text-body-2-medium w-20 shrink-0 rounded-xl py-3.5 ${
            authCodeValid === true
              ? 'cursor-not-allowed bg-gray-200 text-gray-600'
              : authCode.length >= 4
                ? 'cursor-pointer bg-purple-200 text-purple-700'
                : 'cursor-not-allowed bg-gray-200 text-gray-600'
          }`}
          onClick={handleVerifyAuthCode}
          disabled={!authCode || authCodeValid === true}
        >
          {authCodeValid === true ? '인증완료' : '확인하기'}
        </button>
      </div>
      {authCodeError && (
        <div className="px-1.5 pt-1.5">
          <p className="text-caption-1-medium text-error">{authCodeError}</p>
        </div>
      )}
      {authCodeValid === true && (
        <div className="px-1.5 pt-1.5">
          <p className="text-caption-1-medium text-purple-700">인증번호가 확인되었습니다.</p>
        </div>
      )}
    </div>
  );
};
