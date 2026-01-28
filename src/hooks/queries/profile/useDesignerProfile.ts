import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyDesignerProfile, getPublicDesignerProfile, updateMyDesignerProfile } from '@/src/apis/profile';
import { useToast } from '@/src/hooks/common/useToast';
import { mypageKeys } from '@/src/hooks/queries/mypage';
import type { ApiResponse } from '@/src/types';
import type { DesignerProfileResponse, DesignerProfileUpdateRequest } from '@/src/types/profile';

export const publicProfileKeys = {
  all: ['publicProfile'] as const,
  designer: () => [...publicProfileKeys.all, 'designer'] as const,
  designerDetail: (designerId: number) => [...publicProfileKeys.designer(), designerId] as const,
};

export const designerProfileKeys = {
  all: ['designerProfile'] as const,
  my: () => [...designerProfileKeys.all, 'my'] as const,
};

interface UsePublicDesignerProfileParams {
  designerId: number | null;
  enabled?: boolean;
}

interface UseMyDesignerProfileOptions {
  enabled?: boolean;
}

/**
 * 디자이너 공개 프로필 조회 Hook
 * 샵 마커 클릭 시 해당 디자이너의 프로필 및 공고 목록을 가져옵니다.
 */
export function usePublicDesignerProfile({ designerId, enabled = true }: UsePublicDesignerProfileParams) {
  return useQuery<ApiResponse<DesignerProfileResponse>, Error>({
    queryKey: publicProfileKeys.designerDetail(designerId ?? 0),
    queryFn: () => getPublicDesignerProfile(designerId!),
    enabled: enabled && designerId !== null,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 디자이너 본인 프로필 조회 Hook
 */
export function useMyDesignerProfile(options: UseMyDesignerProfileOptions = {}) {
  const { enabled = true } = options;

  return useQuery<ApiResponse<DesignerProfileResponse>, Error>({
    queryKey: designerProfileKeys.my(),
    queryFn: getMyDesignerProfile,
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 디자이너 본인 공개 프로필 수정 Hook
 */
export function useUpdateMyDesignerProfile() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<DesignerProfileResponse>, Error, DesignerProfileUpdateRequest>({
    mutationFn: (payload) => updateMyDesignerProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designerProfileKeys.all });
      queryClient.invalidateQueries({ queryKey: publicProfileKeys.all });
      queryClient.invalidateQueries({ queryKey: mypageKeys.all });
      showToast('프로필이 저장되었습니다.');
    },
    onError: () => {
      showToast('프로필 저장에 실패했습니다.');
    },
  });
}
