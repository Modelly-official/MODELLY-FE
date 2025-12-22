'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FixedBottomButton } from '@/src/components/signup';
import { useSendResetPasswordCode, useVerifyEmailCode, useVerifyResetPassword } from '@/src/hooks/queries';
import { validateEmail } from '@/src/utils/auth/find-password';
import { useTimer } from '@/src/hooks/auth/find-password';
import { AuthHeader, Spinner, AuthCodeInputWithTimer } from '@/src/components/auth';

interface StepInputProps {
  goNext: (name: string, loginId: string, email: string) => void;
  goSocialUser: (name: string, loginType: string) => void;
}

export const StepInput: React.FC<StepInputProps> = ({ goNext, goSocialUser }) => {
  const router = useRouter();

  // React Query Hooks
  const sendCodeMutation = useSendResetPasswordCode();
  const verifyCodeMutation = useVerifyEmailCode();
  const verifyResetMutation = useVerifyResetPassword();

  // Custom Hooks
  const { timer, startTimer } = useTimer();

  // 입력 상태
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');

  // 인증 상태
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  // 인증번호 발송
  const handleSendCode = useCallback(() => {
    if (!name || !loginId || !validateEmail(email)) return;

    sendCodeMutation.mutate(
      { name, loginId, email },
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
            response?: { data?: { message?: string; code?: string; result?: { loginType?: string } } };
          };
          const errorMessage = axiosError.response?.data?.message || '인증번호 발송 중 오류가 발생했습니다.';
          const loginType = axiosError.response?.data?.result?.loginType;

          // 소셜 로그인 사용자인 경우
          if (loginType && loginType !== 'JWT') {
            goSocialUser(name, loginType);
          } else {
            alert(errorMessage);
          }
        },
      },
    );
  }, [name, loginId, email, sendCodeMutation, goSocialUser, startTimer]);

  // 인증번호 확인
  const handleVerifyCode = useCallback(() => {
    if (!authCode || authCode.length < 4) return;

    verifyCodeMutation.mutate(
      { email, authCode, type: 'RESET_PASSWORD' },
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

  // 비밀번호 재설정 진행 (사용자 정보 검증)
  const handleNextStep = useCallback(() => {
    if (!isVerified) return;

    verifyResetMutation.mutate(
      { name, loginId, email },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            goNext(name, loginId, email);
          } else {
            alert(response.message || '사용자 정보 검증에 실패했습니다.');
          }
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage = axiosError.response?.data?.message || '사용자 정보 검증 중 오류가 발생했습니다.';
          alert(errorMessage);
        },
      },
    );
  }, [isVerified, name, loginId, email, verifyResetMutation, goNext]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <AuthHeader onBack={() => router.back()} />

      {/* 제목 */}
      <div className="mt-4 mx-4">
        <h1 className="text-head-3-semibold text-gray-900 tracking-tight">비밀번호 찾기</h1>
        <p className="text-body-1-medium text-gray-700 tracking-tight mt-2">
          가입한 아이디를 입력해주세요.
          <br />
          이메일 인증을 통해 비밀번호를 변경합니다.
        </p>
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
            disabled={codeSent}
          />
        </div>

        {/* 아이디 입력 */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-900 text-body-1-medium tracking-tight">아이디</label>
          <input
            type="text"
            className="border border-gray-400 rounded-xl px-4 py-3 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none tracking-tight"
            placeholder="아이디를 입력해주세요"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            maxLength={20}
            disabled={codeSent}
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
                  : name && loginId && validateEmail(email)
                    ? 'bg-blue-200 text-blue-700 cursor-pointer'
                    : 'bg-gray-200 text-gray-600 cursor-not-allowed'
              }`}
              onClick={handleSendCode}
              disabled={((!name || !loginId || !validateEmail(email)) && !codeSent) || sendCodeMutation.isPending}
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
          <FixedBottomButton disabled={!isVerified || verifyResetMutation.isPending} onClick={handleNextStep}>
            {verifyResetMutation.isPending ? '검증 중...' : '비밀번호 재설정'}
          </FixedBottomButton>
        </div>
      </form>
    </div>
  );
};
