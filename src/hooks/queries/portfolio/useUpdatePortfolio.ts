import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePortfolio } from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import { portfolioKeys } from './useDesignerPortfolios';
import type {
  ApiResponse,
  DesignerPortfolioDetail,
  DesignerPortfolioListResponse,
  UpdatePortfolioRequest,
  PortfolioMutationResponse,
} from '@/src/types';

interface UpdatePortfolioParams {
  portfolioId: number;
  request: UpdatePortfolioRequest;
}

/**
 * 포트폴리오 수정 Mutation Hook
 */
export function useUpdatePortfolio() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    ApiResponse<PortfolioMutationResponse>,
    Error,
    UpdatePortfolioParams
  >({
    mutationFn: ({ portfolioId, request }: UpdatePortfolioParams) => {
      return updatePortfolio(portfolioId, request);
    },
    onSuccess: (_data, variables) => {
      const nextThumbnail = variables.request.imageUrls?.[0] ?? variables.request.thumbnail;
      queryClient.setQueryData<ApiResponse<DesignerPortfolioDetail>>(
        portfolioKeys.detail(variables.portfolioId),
        (oldData) => {
          if (!oldData?.result) return oldData;

          return {
            ...oldData,
            result: {
              ...oldData.result,
              title: variables.request.title,
              content: variables.request.content,
              subCategoryList: variables.request.subCategoryList,
              imageList: variables.request.imageUrls,
            },
          };
        }
      );
      queryClient.setQueriesData(
        { queryKey: portfolioKeys.lists() },
        (oldData: { pages: ApiResponse<DesignerPortfolioListResponse>[]; pageParams: unknown[] } | undefined) => {
          if (!oldData) return oldData;

          const nextPages = oldData.pages.map((page) => ({
            ...page,
            result: {
              ...page.result,
              items: page.result.items.map((item) =>
                item.portfolioId === variables.portfolioId
                  ? { ...item, thumbnail: nextThumbnail }
                  : item
              ),
            },
          }));

          return { ...oldData, pages: nextPages };
        }
      );
      showToast('포트폴리오가 수정되었습니다.');
    },
    onError: () => {
      showToast('포트폴리오 수정에 실패했습니다.');
    },
  });
}
