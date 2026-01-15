import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { getDesignerProfile, getModelProfile } from '@/src/apis';
import { mypageKeys } from '@/src/hooks/queries/mypage';

type Role = 'model' | 'designer';

// 프로필 조회 결과 타입
export type ProfileResult =
  | {
      role: 'designer';
      data: Awaited<ReturnType<typeof getDesignerProfile>>['result'];
    }
  | {
      role: 'model';
      data: Awaited<ReturnType<typeof getModelProfile>>['result'];
    };

// 마이페이지 메인용 간소화된 프로필 타입
export type SimpleProfileResult = {
  role: Role;
  profile: {
    nickname: string;
    email?: string;
    profileImageUrl: string | null;
  };
};

interface UseProfileWithFallbackOptions {
  roleHint: Role | null;
  enabled: boolean;
}

/**
 * 프로필 조회 훅 (역할 폴백 지원)
 * - roleHint에 따라 적절한 API 호출
 * - 403/404 에러 시 다른 역할로 폴백
 */
export function useProfileWithFallback({ roleHint, enabled }: UseProfileWithFallbackOptions) {
  return useQuery<ProfileResult>({
    queryKey: mypageKeys.profileByRole(roleHint ?? 'model'),
    enabled,
    retry: false,
    queryFn: async () => {
      const fetchDesigner = async (): Promise<ProfileResult> => {
        const res = await getDesignerProfile();
        return { role: 'designer', data: res.result };
      };

      const fetchModel = async (): Promise<ProfileResult> => {
        const res = await getModelProfile();
        return { role: 'model', data: res.result };
      };

      try {
        if (roleHint === 'designer') return await fetchDesigner();
        if (roleHint === 'model') return await fetchModel();
        // 역할 불명확 시 모델 먼저 시도
        return await fetchModel();
      } catch (error) {
        const shouldFallback =
          isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 404);

        if (shouldFallback) {
          // 모델 403/404 시 디자이너로 폴백
          return fetchDesigner();
        }
        throw error;
      }
    },
  });
}

/**
 * 마이페이지 메인용 간소화된 프로필 조회 훅
 * - 닉네임, 이메일, 프로필 이미지만 필요한 경우 사용
 */
export function useSimpleProfile({ roleHint, enabled }: UseProfileWithFallbackOptions) {
  return useQuery<SimpleProfileResult>({
    queryKey: [...mypageKeys.profileByRole(roleHint ?? 'model'), 'simple'],
    enabled,
    retry: false,
    queryFn: async () => {
      const fetchDesigner = async (): Promise<SimpleProfileResult> => {
        const res = await getDesignerProfile();
        return {
          role: 'designer',
          profile: {
            nickname: res.result.nickname,
            email: res.result.email,
            profileImageUrl: res.result.profileImageUrl,
          },
        };
      };

      const fetchModel = async (): Promise<SimpleProfileResult> => {
        const res = await getModelProfile();
        return {
          role: 'model',
          profile: {
            nickname: res.result.nickname,
            email: res.result.email,
            profileImageUrl: res.result.profileImageUrl,
          },
        };
      };

      try {
        if (roleHint === 'designer') return await fetchDesigner();
        if (roleHint === 'model') return await fetchModel();
        return await fetchModel();
      } catch (error) {
        const shouldFallback =
          isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 404);

        if (shouldFallback) {
          return fetchDesigner();
        }
        throw error;
      }
    },
  });
}
