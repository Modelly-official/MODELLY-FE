import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDesignerProfile, getModelProfile, updateDesignerProfile, updateModelProfile } from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import type {
  MypageModelProfileResponse,
  MypageModelProfileUpdateRequest,
  MypageDesignerProfileResponse,
  MypageDesignerProfileUpdateRequest,
} from '@/src/types';

export const mypageKeys = {
  all: ['mypage'] as const,
  profile: () => [...mypageKeys.all, 'profile'] as const,
  profileByRole: (role: 'model' | 'designer') => [...mypageKeys.profile(), role] as const,
  model: ['mypage', 'model'] as const,
  designer: ['mypage', 'designer'] as const,
};

// Model Profile
export function useModelProfile(enabled: boolean) {
  return useQuery<MypageModelProfileResponse, Error>({
    queryKey: mypageKeys.model,
    queryFn: getModelProfile,
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateModelProfile() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<MypageModelProfileResponse, Error, MypageModelProfileUpdateRequest>({
    mutationFn: (payload) => updateModelProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mypageKeys.all });
      showToast('프로필이 저장되었습니다.');
    },
    onError: () => {
      showToast('프로필 저장에 실패했습니다.');
    },
  });
}

// Designer Profile
export function useDesignerProfile(enabled: boolean) {
  return useQuery<MypageDesignerProfileResponse, Error>({
    queryKey: mypageKeys.designer,
    queryFn: getDesignerProfile,
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateDesignerProfile() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<MypageDesignerProfileResponse, Error, MypageDesignerProfileUpdateRequest>({
    mutationFn: (payload) => updateDesignerProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mypageKeys.all });
      showToast('프로필이 저장되었습니다.');
    },
    onError: () => {
      showToast('프로필 저장에 실패했습니다.');
    },
  });
}
