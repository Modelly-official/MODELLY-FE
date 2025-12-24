import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleRecruitmentLike, toggleDesignerLike } from '@/src/apis';
import { useAuthStore } from '@/src/stores';
import { useToast } from '@/src/hooks/common/useToast';
import { recruitmentKeys } from '../explore/useRecruitments';
import { designerKeys } from '../explore/useDesigners';
import type { ApiResponse } from '@/src/types';

/**
 * 공고 찜하기 Mutation Hook
 * 미로그인 시 토스트 메시지 표시 후 요청 차단
 */
export function useToggleRecruitmentLike() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  return useMutation<ApiResponse<string>, Error, number>({
    mutationFn: (recruitmentId: number) => {
      if (!isAuthenticated) {
        showToast('로그인이 필요한 기능입니다.');
        return Promise.reject(new Error('Unauthorized'));
      }
      return toggleRecruitmentLike(recruitmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentKeys.lists() });
    },
  });
}

/**
 * 디자이너 찜하기 Mutation Hook
 * 미로그인 시 토스트 메시지 표시 후 요청 차단
 */
export function useToggleDesignerLike() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  return useMutation<ApiResponse<string>, Error, number>({
    mutationFn: (designerId: number) => {
      if (!isAuthenticated) {
        showToast('로그인이 필요한 기능입니다.');
        return Promise.reject(new Error('Unauthorized'));
      }
      return toggleDesignerLike(designerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designerKeys.lists() });
    },
  });
}
