import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRecruitment } from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import { myRecruitmentKeys } from './useDesignerRecruitments';
import { recruitmentKeys } from '../explore/useRecruitments';
import type { ApiResponse, UpdateRecruitmentRequest, RecruitmentMutationResponse } from '@/src/types';

interface UpdateRecruitmentParams {
  recruitmentId: number;
  request: UpdateRecruitmentRequest;
}

/**
 * 공고 수정 Mutation Hook
 */
export function useUpdateRecruitment() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    ApiResponse<RecruitmentMutationResponse>,
    Error,
    UpdateRecruitmentParams
  >({
    mutationFn: ({ recruitmentId, request }: UpdateRecruitmentParams) => {
      return updateRecruitment(recruitmentId, request);
    },
    onSuccess: (_data, variables) => {
      // 내 공고 목록 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: myRecruitmentKeys.lists() });
      // 공고 상세 쿼리 갱신
      queryClient.invalidateQueries({
        queryKey: recruitmentKeys.detail(variables.recruitmentId),
      });
      showToast('공고가 수정되었습니다.');
    },
    onError: () => {
      showToast('공고 수정에 실패했습니다.');
    },
  });
}
