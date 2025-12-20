'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLogin } from '@/src/hooks/queries';
import { useAuthStore } from '@/src/stores';
import { SOCIAL_LOGIN_URLS } from '@/src/utils';

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { setUser } = useAuthStore();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useLogin();

  const handleLogin = () => {
    if (!loginId || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    loginMutation.mutate(
      { loginId, password },
      {
        onSuccess: (response) => {
          if (response.isSuccess && response.result) {
            // 사용자 정보 저장 (옵션 - 미들웨어가 다시 검증함)
            setUser({
              userId: response.result.userId,
              role: response.result.userRole.toLowerCase() as 'model' | 'designer',
              username: loginId,
              loginId,
            });

            // 원래 페이지로 리다이렉트
            router.push(callbackUrl);
          } else {
            alert(response.message || '로그인에 실패했습니다.');
          }
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage = axiosError.response?.data?.message || '로그인 중 오류가 발생했습니다.';
          alert(errorMessage);
        },
      },
    );
  };

  return (
    <div className="relative bg-white font-sans">
      {/* Modelly 로고 */}
      <div className="mt-[164px] mx-auto mb-0 w-[212px] h-[58px]">
        <Image
          src="/images/modelly.svg"
          alt="Modelly Logo"
          width={212}
          height={58}
          className="w-full h-full"
          priority
        />
      </div>

      {/* 입력 폼 */}
      <div className="mt-6 mx-4 w-[calc(100%-2rem)] sm:w-[343px]">
        <div className="mb-4">
          <label className="block text-black text-body-1-medium mb-2 tracking-tight">아이디</label>
          <input
            type="text"
            placeholder="아이디를 입력하세요"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="w-full border border-gray-400 rounded-xl p-4 text-black placeholder:text-gray-600 text-body-2-medium tracking-tight bg-white outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-black text-body-1-medium mb-2 tracking-tight">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full border border-gray-400 rounded-xl p-4 text-black placeholder:text-gray-600 text-body-2-medium tracking-tight bg-white outline-none"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          disabled={loginMutation.isPending}
          className="w-full bg-gray-900 text-blue-100 rounded-full py-4 px-2 text-body-1-semibold tracking-tight mb-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </button>

        {/* 하단 링크 */}
        <div className="flex gap-4 text-gray-800 text-body-2-medium tracking-tight justify-center mb-20">
          <span>아이디 찾기</span>
          <span>|</span>
          <span>비밀번호 찾기</span>
          <span>|</span>
          <Link href="/signup" className="cursor-pointer hover:underline">
            회원가입
          </Link>
        </div>

        {/* SNS 로그인 안내 */}
        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="w-[98px] h-px bg-gray-500" />
          <span className="text-gray-700 text-body-2-regular">SNS 계정으로 로그인</span>
          <div className="w-[98px] h-px bg-gray-500" />
        </div>

        {/* SNS 아이콘 */}
        <div className="flex gap-6 justify-center">
          {/* 카카오 로그인 */}
          <button
            onClick={() => (window.location.href = SOCIAL_LOGIN_URLS.kakao)}
            className="w-[60px] h-[60px] rounded-full cursor-pointer bg-[#FFE812] flex justify-center pt-[14px] pb-[10px]"
          >
            <Image src="/icons/login/kakao.svg" alt="카카오 로그인" width={36} height={36} />
          </button>
          {/* 네이버 로그인 */}
          <button
            onClick={() => (window.location.href = SOCIAL_LOGIN_URLS.naver)}
            className="w-[60px] h-[60px] rounded-full cursor-pointer bg-[#00C737] flex justify-center items-center"
          >
            <Image src="/icons/login/naver.svg" alt="네이버 로그인" width={24} height={24} />
          </button>
          {/* 구글 로그인 */}
          <button
            onClick={() => (window.location.href = SOCIAL_LOGIN_URLS.google)}
            className="w-[60px] h-[60px] rounded-full cursor-pointer bg-gray-300 flex items-center justify-center"
          >
            <Image src="/icons/login/google.svg" alt="구글 로그인" width={30} height={31} />
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">로딩 중...</div>}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
