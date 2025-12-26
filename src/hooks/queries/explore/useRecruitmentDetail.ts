import { useQuery } from '@tanstack/react-query';
import { getRecruitmentDetail } from '@/src/apis';
import { recruitmentKeys } from './useRecruitments';
import type { RecruitmentDetail, ApiResponse } from '@/src/types';

interface UseRecruitmentDetailOptions {
  enabled?: boolean;
}

/**
 * 공고 상세 조회 Hook
 */
export function useRecruitmentDetail(
  recruitmentId: number,
  options: UseRecruitmentDetailOptions = {}
) {
  const { enabled = true } = options;

  return useQuery<ApiResponse<RecruitmentDetail>, Error>({
    queryKey: recruitmentKeys.detail(recruitmentId),
    queryFn: () => getRecruitmentDetail(recruitmentId),
    enabled: enabled && recruitmentId > 0,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
