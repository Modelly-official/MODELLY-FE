'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAccessToken, setUserRole } from '@/src/stores';

/**
 * 소셜 로그인 콜백 페이지
 * 백엔드가 OAuth 처리 후 이 페이지로 리다이렉트합니다.
 *
 * 성공 시 쿼리 파라미터:
 * - accessToken: 액세스 토큰
 * - registered: 회원가입 여부 (true/false)
 * - userId: 사용자 ID
 * - userRole: 사용자 역할 (MODEL/DESIGNER)
 *
 * 에러 시 쿼리 파라미터:
 * - errorCode: 에러 코드 (예: AUTH409)
 * - errorMessage: 에러 메시지
 */
const SocialLoginCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 에러 체크 (먼저 확인)
    const errorCode = searchParams.get('errorCode');
    const errorMessage = searchParams.get('errorMessage');

    if (errorCode && errorMessage) {
      // 에러 발생 - 로그인 페이지로 리다이렉트 (에러 메시지 표시)
      alert(decodeURIComponent(errorMessage));
      router.push('/login');
      return;
    }

    const accessToken = searchParams.get('accessToken');
    const registered = searchParams.get('registered');
    const userRole = searchParams.get('userRole');

    // 필수 파라미터 확인
    if (!accessToken || !registered) {
      alert('잘못된 접근입니다. 다시 로그인해주세요.');
      router.push('/login');
      return;
    }

    // accessToken을 쿠키에 저장
    setAccessToken(accessToken);

    // userRole을 쿠키에 저장 (백엔드는 대문자로 보내주므로 소문자로 변환)
    if (userRole) {
      setUserRole(userRole.toLowerCase() as 'model' | 'designer');
    }

    // registered 값에 따라 분기
    if (registered === 'true') {
      // 이미 회원가입된 사용자 → 홈으로 이동
      router.push('/');
    } else {
      // 회원가입이 필요한 사용자 → 회원가입 페이지로 이동
      router.push('/signup?social=true');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
        <p className="text-gray-700 text-body-1-medium">로그인 처리 중...</p>
      </div>
    </div>
  );
};

const SocialLoginCallbackPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            </div>
            <p className="text-gray-700 text-body-1-medium">로딩 중...</p>
          </div>
        </div>
      }
    >
      <SocialLoginCallbackContent />
    </Suspense>
  );
};

export default SocialLoginCallbackPage;
