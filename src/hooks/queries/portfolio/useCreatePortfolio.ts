import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPortfolio } from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import { portfolioKeys } from './useDesignerPortfolios';
import type {
  ApiResponse,
  CreatePortfolioRequest,
  DesignerPortfolioListResponse,
  PortfolioMutationResponse,
} from '@/src/types';

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
    onSuccess: (data, variables) => {
      const nextThumbnail = variables.imageUrls?.[0] ?? variables.thumbnail;
      const parsedId = Number(data?.result);
      const isValidId = Number.isFinite(parsedId) && parsedId > 0;

      if (!isValidId) {
        queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
        showToast('포트폴리오가 등록되었습니다.');
        return;
      }

      queryClient.setQueriesData(
        { queryKey: portfolioKeys.lists() },
        (oldData: { pages: ApiResponse<DesignerPortfolioListResponse>[]; pageParams: unknown[] } | undefined) => {
          if (!oldData) return oldData;
          const firstPage = oldData.pages[0];
          if (!firstPage) return oldData;

          const nextPages = [
            {
              ...firstPage,
              result: {
                ...firstPage.result,
                items: [
                  { portfolioId: parsedId, thumbnail: nextThumbnail },
                  ...firstPage.result.items,
                ],
                totalCount: firstPage.result.totalCount + 1,
              },
            },
            ...oldData.pages.slice(1),
          ];

          return { ...oldData, pages: nextPages };
        }
      );
      showToast('포트폴리오가 등록되었습니다.');
    },
    onError: () => {
      showToast('포트폴리오 등록에 실패했습니다.');
    },
  });
}
