import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePortfolio } from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import { portfolioKeys } from './useDesignerPortfolios';
import type { ApiResponse } from '@/src/types';

/**
 * 포트폴리오 삭제 Mutation Hook
 */
export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<string>, Error, number>({
    mutationFn: (portfolioId: number) => {
      return deletePortfolio(portfolioId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      showToast('포트폴리오가 삭제되었습니다.');
    },
    onError: () => {
      showToast('포트폴리오 삭제에 실패했습니다.');
    },
  });
}
