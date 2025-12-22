'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FixedBottomButton } from '@/src/components/signup';
import { useSendFindIdCode, useVerifyEmailCode, useFindId } from '@/src/hooks/queries';
import { validateEmail } from '@/src/utils/auth/find-id';
import { useTimer } from '@/src/hooks/auth/find-id';
import { AuthHeader, Spinner, AuthCodeInputWithTimer } from '@/src/components/auth';

interface StepInputProps {
  goNext: (name: string, loginId: string, loginType: string) => void;
}

export const StepInput: React.FC<StepInputProps> = ({ goNext }) => {
  const router = useRouter();

  // React Query Hooks
  const sendCodeMutation = useSendFindIdCode();
  const verifyCodeMutation = useVerifyEmailCode();
  const findIdMutation = useFindId();

  // Custom Hooks
  const { timer, startTimer } = useTimer();

  // 입력 상태
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');

  // 인증 상태
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  // 인증번호 발송
  const handleSendCode = useCallback(() => {
    if (!name || !validateEmail(email)) return;

    sendCodeMutation.mutate(
      { name, email },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            setCodeSent(true);
            startTimer(180); // 3분
            setError('');
            setAuthCode('');
            setIsVerified(false);
          } else {
            alert(response.message || '인증번호 발송에 실패했습니다.');
          }
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage = axiosError.response?.data?.message || '인증번호 발송 중 오류가 발생했습니다.';
          alert(errorMessage);
        },
      },
    );
  }, [name, email, sendCodeMutation, startTimer]);

  // 인증번호 확인
  const handleVerifyCode = useCallback(() => {
    if (!authCode) return;

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
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage = axiosError.response?.data?.message || '인증번호 검증 중 오류가 발생했습니다.';
          setError(errorMessage);
        },
      },
    );
  }, [email, authCode, verifyCodeMutation]);

  // 인증번호 입력 변경
  const handleAuthCodeChange = useCallback((value: string) => {
    setAuthCode(value);
    setError('');
  }, []);

  // 아이디 찾기 완료
  const handleFindId = useCallback(() => {
    if (!isVerified) return;

    findIdMutation.mutate(
      { name, email },
      {
        onSuccess: (response) => {
          if (response.isSuccess && response.result) {
            goNext(response.result.name, response.result.loginId, response.result.loginType);
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <AuthHeader onBack={() => router.back()} />

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
                  : name && validateEmail(email)
                    ? 'bg-blue-200 text-blue-700 cursor-pointer'
                    : 'bg-gray-200 text-gray-600 cursor-not-allowed'
              }`}
              onClick={handleSendCode}
              disabled={!name || !validateEmail(email) || sendCodeMutation.isPending}
            >
              {sendCodeMutation.isPending ? (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              ) : codeSent ? (
                '다시받기'
              ) : (
                '인증하기'
              )}
            </button>
          </div>

          {/* 인증번호 입력 (인증번호 발송 후에만 표시) */}
          {codeSent && (
            <AuthCodeInputWithTimer
              authCode={authCode}
              onAuthCodeChange={handleAuthCodeChange}
              timer={timer}
              isVerified={isVerified}
              error={error}
              isLoading={verifyCodeMutation.isPending}
              onVerify={handleVerifyCode}
            />
          )}
        </div>

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
