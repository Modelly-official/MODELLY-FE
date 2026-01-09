import { useState, useEffect } from 'react';
import { uploadProfileImage } from '@/src/apis';
import { useUpdateDesignerProfile, useUpdateModelProfile } from '@/src/hooks/queries';
import { useToast } from '@/src/hooks/common/useToast';
import { useAuthReady } from './useAuthReady';
import { useProfileWithFallback } from './useProfileWithFallback';
import { mapProfileResponseToForm, buildProfilePayload } from '@/src/utils/mypage/profileTransform';
import { isValidBirthDate, isValidGender, isValidCategory } from '@/src/utils/mypage/validation';
import { formatBirthDate } from '@/src/utils/signup/profileFormat';
import { CATEGORY_OPTIONS } from '@/src/constants/mypage';
import type { ProfileEditFormState, UserRole } from '@/src/types/mypage';
import { PROFILE_EDIT_INITIAL_STATE } from '@/src/types/mypage';

/**
 * 프로필 수정 폼 로직을 관리하는 커스텀 훅
 * - 인증 상태 확인
 * - 프로필 데이터 조회 및 폼 초기화
 * - 폼 상태 관리
 * - 이미지 업로드
 * - 폼 검증
 * - 제출 처리
 */
export function useProfileEditForm() {
  const { showToast } = useToast();
  const { user, role, isLoggedIn, authReady, cookieCategory } = useAuthReady();

  // 역할 힌트 계산
  const roleHint = user?.role ?? role ?? (cookieCategory ? 'designer' : null);

  // 프로필 데이터 조회
  const { data: profileResponse, isLoading: isProfileLoading } = useProfileWithFallback({
    roleHint,
    enabled: authReady && isLoggedIn,
  });

  // 폼 상태
  const [form, setForm] = useState<ProfileEditFormState>(PROFILE_EDIT_INITIAL_STATE);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Mutations
  const updateModelMutation = useUpdateModelProfile();
  const updateDesignerMutation = useUpdateDesignerProfile();

  // 현재 역할
  const currentRole: UserRole = profileResponse?.role ?? 'model';

  // 프로필 데이터로 폼 초기화 (한 번만)
  useEffect(() => {
    if (!profileResponse || isFormInitialized) return;
    setForm(mapProfileResponseToForm(profileResponse));
    setIsFormInitialized(true);
  }, [profileResponse, isFormInitialized]);

  // 필드 업데이트
  const updateField = <K extends keyof ProfileEditFormState>(
    key: K,
    value: ProfileEditFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 생년월일 업데이트 (포맷팅 적용)
  const updateBirthDate = (value: string) => {
    updateField('birthDate', formatBirthDate(value));
  };

  // 이미지 업로드
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const imageUrl = await uploadProfileImage(file);
      updateField('profileImage', imageUrl);
      showToast('이미지가 업로드되었습니다.');
    } catch {
      showToast('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 폼 검증
  const isFormValid = (() => {
    const hasBasicFields =
      form.nickname.trim() &&
      isValidGender(form.gender) &&
      isValidBirthDate(form.birthDate);

    if (currentRole === 'model') {
      return hasBasicFields;
    }

    // 디자이너는 추가 필드 검증
    return (
      hasBasicFields &&
      form.intro.trim() &&
      form.storeName.trim() &&
      form.address.trim() &&
      isValidCategory(form.category, [...CATEGORY_OPTIONS])
    );
  })();

  // 제출
  const handleSubmit = async () => {
    if (!isFormValid || isSaving || isUploading || isProfileLoading) return;

    setIsSaving(true);
    try {
      const payload = buildProfilePayload(form, currentRole);

      if (currentRole === 'designer') {
        await updateDesignerMutation.mutateAsync(payload as Parameters<typeof updateDesignerMutation.mutateAsync>[0]);
      } else {
        await updateModelMutation.mutateAsync(payload as Parameters<typeof updateModelMutation.mutateAsync>[0]);
      }
    } catch {
      // 에러는 mutation의 onError에서 처리됨
    } finally {
      setIsSaving(false);
    }
  };

  return {
    // 인증 상태
    isLoggedIn,
    authReady,

    // 폼 상태
    form,
    updateField,
    updateBirthDate,
    handleImageUpload,

    // 역할
    currentRole,

    // 로딩 상태
    isProfileLoading,
    isUploading,
    isSaving,
    isLoading: isProfileLoading || isSaving || isUploading,

    // 검증 및 제출
    isFormValid,
    handleSubmit,
  };
}
