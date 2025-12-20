import React from 'react';

interface AuthCodeInputProps {
  authCode: string;
  setAuthCode: (value: string) => void;
  handleVerifyAuthCode: () => void;
  authCodeError: string;
  authCodeValid: boolean | null;
  requestSent: boolean;
}

export const AuthCodeInput: React.FC<AuthCodeInputProps> = ({
  authCode,
  setAuthCode,
  handleVerifyAuthCode,
  authCodeError,
  authCodeValid,
  requestSent,
}) => {
  if (!requestSent) return null;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center min-w-0">
        <input
          type="text"
          className={`flex-1 border ${authCodeValid === false ? 'border-error' : 'border-gray-400'} rounded-xl px-4 h-[49px] text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none`}
          placeholder="인증번호 입력"
          value={authCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthCode(e.target.value)}
          maxLength={6}
          autoComplete="off"
        />
        <button
          type="button"
          className="w-20 rounded-xl h-[49px] text-body-2-medium bg-blue-200 text-blue-700 cursor-pointer"
          onClick={handleVerifyAuthCode}
          disabled={!authCode}
        >
          확인하기
        </button>
      </div>
      {authCodeError && <p className="text-caption-1 text-error mt-1">{authCodeError}</p>}
      {authCodeValid === true && <p className="text-caption-1 text-blue-700 mt-1">인증번호가 확인되었습니다.</p>}
    </div>
  );
};
