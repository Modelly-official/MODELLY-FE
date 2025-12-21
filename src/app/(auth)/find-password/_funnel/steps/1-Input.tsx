'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LeftArrowIcon from '@/public/icons/signup/leftarrow.svg';
import { FixedBottomButton } from '@/src/components/signup';

interface StepInputProps {
  goNext: (name: string, loginId: string, email: string) => void;
  goSocialUser: (name: string, loginType: string) => void;
}

export const StepInput: React.FC<StepInputProps> = ({ goNext, goSocialUser }) => {
  const router = useRouter();

  // 입력 상태
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');

  // 인증 상태
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');

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

  // 인증번호 발송 (임시 구현 - API 연동 전)
  const handleSendCode = () => {
    if (!name || !loginId || !isValidEmail(email)) return;

    // TODO: API 연동 시 구현
    setCodeSent(true);
    setTimer(180); // 3분
    setError('');
    setAuthCode('');
    setIsVerified(false);
  };

  // 인증번호 확인 (임시 구현 - API 연동 전)
  const handleVerifyCode = () => {
    if (!authCode) return;

    // TODO: API 연동 시 구현
    setIsVerified(true);
    setError('');
  };

  // 비밀번호 재설정 진행
  const handleNextStep = () => {
    if (!isVerified) return;

    // TODO: API 연동 시 구현
    goNext(name, loginId, email);
  };

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
              className={`flex-1 border border-gray-400 rounded-xl px-4 h-[49px] text-body-2-medium placeholder:text-gray-600 focus:outline-none tracking-tight ${
                codeSent ? 'bg-gray-100 text-gray-700' : 'bg-white text-gray-900'
              }`}
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={50}
              disabled={codeSent && !isVerified}
            />
            <button
              type="button"
              className={`w-20 rounded-xl h-[49px] text-body-2-medium tracking-tight ${
                codeSent
                  ? 'bg-white text-blue-700 border border-blue-400 cursor-pointer'
                  : name && loginId && isValidEmail(email)
                    ? 'bg-blue-200 text-blue-700 cursor-pointer'
                    : 'bg-gray-200 text-gray-600 cursor-not-allowed'
              }`}
              onClick={handleSendCode}
              disabled={(!name || !loginId || !isValidEmail(email)) && !codeSent}
            >
              {codeSent ? '다시받기' : '인증하기'}
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
                disabled={authCode.length < 4 || isVerified}
              >
                {isVerified ? '인증완료' : '확인하기'}
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
          <FixedBottomButton disabled={!isVerified} onClick={handleNextStep}>
            비밀번호 재설정
          </FixedBottomButton>
        </div>
      </form>
    </div>
  );
};

