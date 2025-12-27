import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRecruitment } from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import { myRecruitmentKeys } from './useDesignerRecruitments';
import type { ApiResponse } from '@/src/types';

/**
 * 공고 삭제 Mutation Hook
 */
export function useDeleteRecruitment() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<string>, Error, number>({
    mutationFn: (recruitmentId: number) => {
      return deleteRecruitment(recruitmentId);
    },
    onSuccess: () => {
      // 내 공고 목록 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: myRecruitmentKeys.lists() });
      showToast('공고가 삭제되었습니다.');
    },
    onError: () => {
      showToast('공고 삭제에 실패했습니다.');
    },
  });
}
