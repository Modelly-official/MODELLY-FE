import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleRecruitmentLike, toggleDesignerLike } from '@/src/apis';
import { recruitmentKeys } from '../explore/useRecruitments';
import { designerKeys } from '../explore/useDesigners';
import type { ApiResponse } from '@/src/types';

/**
 * 공고 찜하기 Mutation Hook
 * 인증 필요 - 컴포넌트에서 로그인 여부 확인 후 호출
 */
export function useToggleRecruitmentLike() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<string>, Error, number>({
    mutationFn: toggleRecruitmentLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentKeys.lists() });
    },
  });
}

/**
 * 디자이너 찜하기 Mutation Hook
 * 인증 필요 - 컴포넌트에서 로그인 여부 확인 후 호출
 */
export function useToggleDesignerLike() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<string>, Error, number>({
    mutationFn: toggleDesignerLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designerKeys.lists() });
    },
  });
}
