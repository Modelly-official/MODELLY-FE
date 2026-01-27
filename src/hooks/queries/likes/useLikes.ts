import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleRecruitmentLike, toggleDesignerLike } from '@/src/apis';
import { getAccessToken } from '@/src/stores';
import { useToast } from '@/src/hooks/common/useToast';
import { recruitmentKeys } from '../explore/useRecruitments';
import { designerKeys } from '../explore/useDesigners';
import { modelHomeKeys } from '../modelHome/useModelHome';
import { likedListKeys } from './useLikedList';
import type { ApiResponse } from '@/src/types';

/**
 * 공고 찜하기 Mutation Hook
 * 미로그인 시 토스트 메시지 표시 후 요청 차단
 */
export function useToggleRecruitmentLike() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<string>, Error, number>({
    mutationFn: (recruitmentId: number) => {
      if (!getAccessToken()) {
        showToast('로그인이 필요한 기능입니다.');
        return Promise.reject(new Error('Unauthorized'));
      }
      return toggleRecruitmentLike(recruitmentId);
    },
    onSuccess: (_, recruitmentId) => {
      // 목록 및 상세 쿼리 모두 갱신
      queryClient.invalidateQueries({ queryKey: recruitmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recruitmentKeys.detail(recruitmentId) });
      queryClient.invalidateQueries({ queryKey: modelHomeKeys.all });
      // 찜 목록 갱신
      queryClient.invalidateQueries({ queryKey: likedListKeys.recruitments() });
    },
  });
}

/**
 * 디자이너 찜하기 Mutation Hook
 * 미로그인 시 토스트 메시지 표시 후 요청 차단
 */
export function useToggleDesignerLike() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<string>, Error, number>({
    mutationFn: (designerId: number) => {
      if (!getAccessToken()) {
        showToast('로그인이 필요한 기능입니다.');
        return Promise.reject(new Error('Unauthorized'));
      }
      return toggleDesignerLike(designerId);
    },
    onSuccess: (_, designerId) => {
      // 목록 및 상세 쿼리 모두 갱신
      queryClient.invalidateQueries({ queryKey: designerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: designerKeys.detail(designerId) });
      queryClient.invalidateQueries({ queryKey: modelHomeKeys.all });
      // 찜 목록 갱신
      queryClient.invalidateQueries({ queryKey: likedListKeys.designers() });
    },
  });
}
