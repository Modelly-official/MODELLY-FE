'use client';

import { use, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAccessToken, setUserRole } from '@/src/stores';
import { useSocialLoginCallback } from '@/src/hooks/queries';
import { showToast } from '@/src/utils';
import type { SocialProvider } from '@/src/utils/auth/socialLogin';
import type { AxiosError } from 'axios';

/**
 * 소셜 로그인 콜백 페이지 (동적 라우팅)
 * 카카오, 네이버, 구글 등 모든 소셜 로그인 프로바이더를 처리합니다.
 */

const PROVIDER_NAMES: Record<SocialProvider, string> = {
  kakao: '카카오',
  naver: '네이버',
  google: '구글',
};

interface PageProps {
  params: Promise<{ provider: string }>;
}

const SocialCallbackPage = ({ params }: PageProps) => {
  const { provider } = use(params); // Promise unwrap
  const router = useRouter();
  const searchParams = useSearchParams();
  const socialLoginMutation = useSocialLoginCallback();

  useEffect(() => {
    const handleSocialLogin = () => {
      // 프로바이더 검증
      if (!(provider in PROVIDER_NAMES)) {
        showToast('지원하지 않는 로그인 방식입니다.');
        router.push('/login');
        return;
      }

      const providerName = PROVIDER_NAMES[provider as SocialProvider];

      // OAuth에서 전달받은 code 파라미터
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // 네이버의 경우 state 파라미터도 확인
      const state = searchParams.get('state');

      // 에러 체크
      if (error) {
        showToast(`${providerName} 로그인 실패: ${errorDescription || error}`);
        router.push('/login');
        return;
      }

      if (!code) {
        showToast('다시 로그인해주세요.');
        router.push('/login');
        return;
      }

      // TanStack Query mutation - onSuccess/onError 콜백
      const mutationPayload = {
        provider,
        payload: {
          code,
          ...(provider === 'naver' && state ? { state } : {}),
        },
      };

      socialLoginMutation.mutate(mutationPayload, {
        onSuccess: (response) => {
          if (response.isSuccess && response.result) {
            const { accessToken, registered, userRole } = response.result;

            // accessToken을 쿠키에 저장
            if (accessToken) {
              setAccessToken(accessToken);
            }

            // userRole을 쿠키에 저장 (백엔드는 대문자로 보내주므로 소문자로 변환)
            if (userRole) {
              const normalizedRole = userRole.toLowerCase();
              if (normalizedRole === 'model' || normalizedRole === 'designer') {
                setUserRole(normalizedRole);
              }
            }

            // registered 값에 따라 분기
            if (registered) {
              // 이미 회원가입된 사용자 → 홈으로 이동
              router.push('/');
            } else {
              // 회원가입이 필요한 사용자 → 회원가입 페이지로 이동
              router.push('/signup?social=true');
            }
          } else {
            showToast(response.message || '로그인 실패');
            router.push('/login');
          }
        },
        onError: (error: Error) => {
          console.error(`${providerName} 로그인 에러:`, error);

          // axios 에러 타입 처리
          const axiosError = error as AxiosError;
          const status = axiosError.response?.status;

          // 409 에러: 이미 가입된 사용자
          if (status === 409) {
            showToast('이미 가입된 사용자입니다.');
            router.push('/login');
            return;
          }

          const errorMessage = error.message || `${providerName} 로그인 중 오류가 발생했습니다.`;
          showToast(errorMessage);
          router.push('/login');
        },
      });
    };

    handleSocialLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router, provider]);

  const providerName = PROVIDER_NAMES[provider as SocialProvider] || '소셜';

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
        <p className="text-body-1-medium text-gray-700">{providerName} 로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default SocialCallbackPage;
