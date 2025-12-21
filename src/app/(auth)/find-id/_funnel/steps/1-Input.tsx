'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LeftArrowIcon from '@/public/icons/signup/leftarrow.svg';
import { FixedBottomButton } from '@/src/components/signup';
import { useSendFindIdCode, useVerifyEmailCode, useFindId } from '@/src/hooks/queries';

interface StepInputProps {
  goNext: (name: string, loginId: string) => void;
}

export const StepInput: React.FC<StepInputProps> = ({ goNext }) => {
  const router = useRouter();

  // React Query Hooks
  const sendCodeMutation = useSendFindIdCode();
  const verifyCodeMutation = useVerifyEmailCode();
  const findIdMutation = useFindId();

  // 입력 상태
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');

  // 인증 상태
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // 이메일 유효성 검증
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 타이머 포맷팅
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // 타이머 로직
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // 인증번호 발송
  const handleSendCode = useCallback(() => {
    if (!name || !isValidEmail(email)) return;

    setIsSendingCode(true);
    sendCodeMutation.mutate(
      { name, email },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            setCodeSent(true);
            setTimer(180); // 3분
            setError('');
            setAuthCode('');
            setIsVerified(false);
            alert(response.result.message || '인증번호가 발송되었습니다.');
          } else {
            alert(response.message || '인증번호 발송에 실패했습니다.');
          }
          setIsSendingCode(false);
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage = axiosError.response?.data?.message || '인증번호 발송 중 오류가 발생했습니다.';
          alert(errorMessage);
          setIsSendingCode(false);
        },
      },
    );
  }, [name, email, sendCodeMutation]);

  // 인증번호 확인
  const handleVerifyCode = useCallback(() => {
    if (!authCode) return;

    setIsVerifyingCode(true);
    verifyCodeMutation.mutate(
      { email, authCode, type: 'FIND_ID' },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            setIsVerified(true);
            setError('');
          } else {
            setIsVerified(false);
            setError(response.message || '인증번호가 일치하지 않습니다.');
          }
          setIsVerifyingCode(false);
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage = axiosError.response?.data?.message || '인증번호 검증 중 오류가 발생했습니다.';
          setError(errorMessage);
          setIsVerifyingCode(false);
        },
      },
    );
  }, [email, authCode, verifyCodeMutation]);

  // 아이디 찾기 완료
  const handleFindId = useCallback(() => {
    if (!isVerified) return;

    findIdMutation.mutate(
      { name, email },
      {
        onSuccess: (response) => {
          if (response.isSuccess && response.result) {
            goNext(response.result.name, response.result.loginId);
          } else {
            alert(response.message || '아이디 찾기에 실패했습니다.');
          }
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage = axiosError.response?.data?.message || '아이디 찾기 중 오류가 발생했습니다.';
          alert(errorMessage);
        },
      },
    );
  }, [isVerified, name, email, goNext, findIdMutation]);

  // 뒤로가기
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="mt-15 mx-4">
        <button type="button" onClick={handleBack} className="w-6 h-6 flex items-center justify-center cursor-pointer">
          <LeftArrowIcon />
        </button>
      </div>

      {/* 제목 */}
      <div className="mt-4 mx-4">
        <h1 className="text-head-3-semibold text-gray-900 tracking-tight">아이디 찾기</h1>
        <p className="text-body-1-medium text-gray-700 tracking-tight mt-2">이메일 인증을 통해 아이디를 확인합니다.</p>
      </div>

      {/* 입력 폼 */}
      <form className="flex flex-col gap-6 mt-8 mx-4 flex-1" onSubmit={(e) => e.preventDefault()}>
        {/* 이름 입력 */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-900 text-body-1-medium tracking-tight">이름 (실명)</label>
          <input
            type="text"
            className="border border-gray-400 rounded-xl px-4 py-3 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none tracking-tight"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
        </div>

        {/* 이메일 입력 + 인증하기 버튼 */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-900 text-body-1-medium tracking-tight">이메일</label>
          <div className="flex gap-2 items-center">
            <input
              type="email"
              className="flex-1 border border-gray-400 rounded-xl px-4 h-[49px] text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none tracking-tight bg-white"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={50}
            />
            <button
              type="button"
              className={`w-20 rounded-xl h-[49px] text-body-2-medium tracking-tight ${
                codeSent
                  ? 'bg-white text-blue-700 border border-blue-400 cursor-pointer'
                  : name && isValidEmail(email)
                    ? 'bg-blue-200 text-blue-700 cursor-pointer'
                    : 'bg-gray-200 text-gray-600 cursor-not-allowed'
              }`}
              onClick={handleSendCode}
              disabled={!name || !isValidEmail(email) || isSendingCode}
            >
              {isSendingCode ? (
                <div className="flex justify-center">
                  <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : codeSent ? (
                '다시받기'
              ) : (
                '인증하기'
              )}
            </button>
          </div>
        </div>

        {/* 인증번호 입력 (인증번호 발송 후에만 표시) */}
        {codeSent && (
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
                  onChange={(e) => {
                    setAuthCode(e.target.value.replace(/[^0-9]/g, ''));
                    setError('');
                  }}
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
                onClick={handleVerifyCode}
                disabled={authCode.length < 4 || isVerified || isVerifyingCode}
              >
                {isVerified ? '인증완료' : '인증완료'}
              </button>
            </div>
            {error && <p className="text-caption-1-medium text-error tracking-tight">{error}</p>}
            {isVerified && (
              <p className="text-caption-1-medium text-blue-700 tracking-tight">인증번호가 확인되었습니다.</p>
            )}
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="mt-auto mb-[42px]">
          <FixedBottomButton disabled={!isVerified || findIdMutation.isPending} onClick={handleFindId}>
            {findIdMutation.isPending ? '조회 중...' : '아이디 찾기'}
          </FixedBottomButton>
        </div>
      </form>
    </div>
  );
};
