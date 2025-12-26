import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRecruitment } from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import { myRecruitmentKeys } from './useDesignerRecruitments';
import type { ApiResponse, CreateRecruitmentRequest, RecruitmentMutationResponse } from '@/src/types';

/**
 * 공고 생성 Mutation Hook
 */
export function useCreateRecruitment() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    ApiResponse<RecruitmentMutationResponse>,
    Error,
    CreateRecruitmentRequest
  >({
    mutationFn: (request: CreateRecruitmentRequest) => {
      return createRecruitment(request);
    },
    onSuccess: () => {
      // 내 공고 목록 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: myRecruitmentKeys.lists() });
      showToast('공고가 등록되었습니다.');
    },
    onError: () => {
      showToast('공고 등록에 실패했습니다.');
    },
  });
}
