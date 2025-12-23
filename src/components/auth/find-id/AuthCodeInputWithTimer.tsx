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
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            className={`w-full border ${
              error ? 'border-error' : 'border-gray-400'
            } text-body-2-medium rounded-xl px-4 py-[14px] tracking-tight text-gray-900 placeholder:text-gray-600 focus:outline-none`}
            placeholder="인증번호 입력"
            value={authCode}
            onChange={(e) => onAuthCodeChange(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={6}
            disabled={isVerified}
          />
          {timer > 0 && !isVerified && (
            <span className="text-caption-1-medium absolute top-1/2 right-4 -translate-y-1/2 text-gray-700">
              {formatTime(timer)}
            </span>
          )}
        </div>
        <button
          type="button"
          className={`text-body-2-medium w-20 shrink-0 rounded-xl py-[14px] tracking-tight ${
            isVerified
              ? 'cursor-not-allowed bg-gray-200 text-gray-600'
              : authCode.length >= 4
                ? 'cursor-pointer bg-purple-200 text-purple-700'
                : 'cursor-not-allowed bg-gray-200 text-gray-600'
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
      {error && (
        <div className="px-[6px] pt-[6px]">
          <p className="text-caption-1-medium text-error tracking-tight">{error}</p>
        </div>
      )}
      {isVerified && (
        <div className="px-[6px] pt-[6px]">
          <p className="text-caption-1-medium tracking-tight text-purple-700">인증번호가 확인되었습니다.</p>
        </div>
      )}
    </div>
  );
};
