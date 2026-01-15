import { useQuery } from '@tanstack/react-query';
import { getPublicDesignerProfile } from '@/src/apis/profile';
import type { ApiResponse } from '@/src/types';
import type { DesignerProfileResponse } from '@/src/types/profile';

export const publicProfileKeys = {
  all: ['publicProfile'] as const,
  designer: () => [...publicProfileKeys.all, 'designer'] as const,
  designerDetail: (designerId: number) => [...publicProfileKeys.designer(), designerId] as const,
};

interface UsePublicDesignerProfileParams {
  designerId: number | null;
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
