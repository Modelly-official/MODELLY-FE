import { useQuery } from '@tanstack/react-query';
import { getRecruitmentDetail } from '@/src/apis';
import { recruitmentKeys } from './useRecruitments';
import type { RecruitmentDetail, ApiResponse } from '@/src/types';

interface UseRecruitmentDetailOptions {
  enabled?: boolean;
  /** 재시도 횟수 (기본값: 글로벌 설정 사용) */
  retry?: number;
  /** 재시도 간격 ms (기본값: 글로벌 설정 사용) */
  retryDelay?: number;
}

/**
 * 공고 상세 조회 Hook
 */
export function useRecruitmentDetail(
  recruitmentId: number,
  options: UseRecruitmentDetailOptions = {}
) {
  const { enabled = true, retry, retryDelay } = options;

  return useQuery<ApiResponse<RecruitmentDetail>, Error>({
    queryKey: recruitmentKeys.detail(recruitmentId),
    queryFn: () => getRecruitmentDetail(recruitmentId),
    enabled: enabled && recruitmentId > 0,
    staleTime: 1000 * 60 * 5, // 5분
    ...(retry !== undefined && { retry }),
    ...(retryDelay !== undefined && { retryDelay }),
  });
}
