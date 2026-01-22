'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useLogin } from '@/src/hooks/queries';
import { useAuthStore } from '@/src/stores';
import { SOCIAL_LOGIN_URLS, showToast } from '@/src/utils';
import { InstallPrompt } from '@/src/components/common';

const LoginContent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useLogin();

  const handleLogin = () => {
    if (!loginId || !password) {
      showToast('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    loginMutation.mutate(
      { loginId, password },
      {
        onSuccess: (response) => {
          if (response.isSuccess && response.result) {
            // API 응답의 role을 정규화 (한글/영어 모두 처리)
            const rawRole = response.result.userRole as string;
            const lowerRole = rawRole.toLowerCase();
            let userRole: 'model' | 'designer';
            if (lowerRole === 'model' || rawRole === '모델') {
              userRole = 'model';
            } else if (lowerRole === 'designer' || rawRole === '디자이너') {
              userRole = 'designer';
            } else {
              userRole = 'model'; // 기본값
            }

            // 이전 사용자의 캐시 클리어
            queryClient.clear();

            // 사용자 정보 저장 (옵션 - 미들웨어가 다시 검증함)
            setUser({
              userId: response.result.userId,
              role: userRole,
              username: loginId,
              loginId,
            });

            // 로그인 성공 시 기본 경로로 이동
            const redirectUrl = '/';
            router.replace(redirectUrl); // 로그인 페이지를 히스토리에서 제거
          } else {
            showToast(response.message || '로그인 실패');
          }
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage = axiosError.response?.data?.message || '로그인 오류';
          showToast(errorMessage);
        },
      },
    );
  };

  return (
    <>
      <div className="relative bg-white font-sans">
        {/* Moandi 로고 */}
        <div className="mx-auto mt-[98px] mb-15 h-[50px] w-[206px]">
          <Image
            src="/images/moandi.svg"
            alt="Moandi Logo"
            width={212}
            height={58}
            className="h-full w-full"
            priority
          />
        </div>

        {/* 입력 폼 */}
        <div className="mx-4 mt-6 w-[calc(100%-2rem)] sm:w-[343px]">
          <div className="mb-4">
            <label className="text-body-1-medium mb-2 block tracking-tight text-black">아이디</label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="text-body-2-medium w-full rounded-xl bg-gray-100 px-4 py-4 tracking-tight text-gray-900 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent"
            />
          </div>
          <div className="mb-6">
            <label className="text-body-1-medium mb-2 block tracking-tight text-black">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="text-body-2-medium w-full rounded-xl bg-gray-100 px-4 py-4 tracking-tight text-gray-900 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className="text-body-1-semibold mb-6 w-full cursor-pointer rounded-full bg-purple-500 px-2 py-4 tracking-tight text-purple-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </button>

          {/* 하단 링크 */}
          <div className="text-body-2-medium mb-16 flex justify-center gap-4 tracking-tight text-gray-800">
            <Link href="/find-id" className="cursor-pointer hover:underline">
              아이디 찾기
            </Link>
            <span>|</span>
            <Link href="/find-password" className="cursor-pointer hover:underline">
              비밀번호 찾기
            </Link>
            <span>|</span>
            <Link href="/signup" className="cursor-pointer hover:underline">
              회원가입
            </Link>
          </div>

          {/* SNS 로그인 안내 */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-[98px] bg-gray-500" />
            <span className="text-body-2-regular text-gray-700">SNS 계정으로 로그인</span>
            <div className="h-px w-[98px] bg-gray-500" />
          </div>

          {/* SNS 아이콘 */}
          <div className="flex justify-center gap-6">
            {/* 카카오 로그인 */}
            <button
              onClick={() => (window.location.href = SOCIAL_LOGIN_URLS.kakao)}
              className="flex h-[60px] w-[60px] cursor-pointer justify-center rounded-full bg-[#FFE812] pt-3.5 pb-2.5"
            >
              <Image src="/icons/login/kakao.svg" alt="카카오 로그인" width={36} height={36} />
            </button>
            {/* 네이버 로그인 */}
            <button
              onClick={() => (window.location.href = SOCIAL_LOGIN_URLS.naver)}
              className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-[#00C737]"
            >
              <Image src="/icons/login/naver.svg" alt="네이버 로그인" width={24} height={24} />
            </button>
            {/* 구글 로그인 */}
            <button
              onClick={() => (window.location.href = SOCIAL_LOGIN_URLS.google)}
              className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-gray-300"
            >
              <Image src="/icons/login/google.svg" alt="구글 로그인" width={30} height={31} />
            </button>
          </div>
        </div>
      </div>
      {/* iOS PWA 설치 안내 (임시) */}
      <InstallPrompt />
    </>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">로딩 중...</div>}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
