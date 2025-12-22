import React from 'react';
import { formatTime } from '@/src/utils/auth/find-id';
import { Spinner } from '../common';

interface AuthCodeInputWithTimerProps {
  authCode: string;
  onAuthCodeChange: (value: string) => void;
  timer: number;
  isVerified: boolean;
  error: string;
  isLoading: boolean;
  onVerify: () => void;
}

/**
 * 인증번호 입력 + 타이머 + 확인 버튼 컴포넌트
 */
export const AuthCodeInputWithTimer: React.FC<AuthCodeInputWithTimerProps> = ({
  authCode,
  onAuthCodeChange,
  timer,
  isVerified,
  error,
  isLoading,
  onVerify,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            className={`w-full border ${
              error ? 'border-error' : 'border-gray-400'
            } rounded-xl px-4 h-[49px] text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none tracking-tight`}
            placeholder="인증번호 입력"
            value={authCode}
            onChange={(e) => onAuthCodeChange(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={6}
            disabled={isVerified}
          />
          {timer > 0 && !isVerified && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-caption-1-medium text-gray-700">
              {formatTime(timer)}
            </span>
          )}
        </div>
        <button
          type="button"
          className={`w-20 rounded-xl h-[49px] text-body-2-medium tracking-tight ${
            isVerified
              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
              : authCode.length >= 4
                ? 'bg-blue-200 text-blue-700 cursor-pointer'
                : 'bg-gray-200 text-gray-600 cursor-not-allowed'
          }`}
          onClick={onVerify}
          disabled={authCode.length < 4 || isVerified || isLoading}
        >
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : isVerified ? (
            '인증완료'
          ) : (
            '확인하기'
          )}
        </button>
      </div>
      {error && <p className="text-caption-1-medium text-error tracking-tight">{error}</p>}
      {isVerified && <p className="text-caption-1-medium text-blue-700 tracking-tight">인증번호가 확인되었습니다.</p>}
    </div>
  );
};
