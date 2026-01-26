import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPortfolio } from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import { portfolioKeys } from './useDesignerPortfolios';
import type { ApiResponse, CreatePortfolioRequest, PortfolioMutationResponse } from '@/src/types';

/**
 * 포트폴리오 생성 Mutation Hook
 */
export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    ApiResponse<PortfolioMutationResponse>,
    Error,
    CreatePortfolioRequest
  >({
    mutationFn: (request: CreatePortfolioRequest) => {
      return createPortfolio(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      showToast('포트폴리오가 등록되었습니다.');
    },
    onError: () => {
      showToast('포트폴리오 등록에 실패했습니다.');
    },
  });
}
