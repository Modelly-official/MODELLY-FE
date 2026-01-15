// 프로필 폼 <-> API 변환 함수

import type { ProfileResult } from '@/src/hooks/custom/mypage/useProfileWithFallback';
import type {
  ProfileEditFormState,
  UserRole,
  MypageModelProfileUpdateRequest,
  MypageDesignerProfileUpdateRequest,
  MypageDesignerProfile,
} from '@/src/types/mypage';
import { convertGenderToDisplay } from '@/src/utils/signup/profileFormat';
import { convertGenderToApi, convertCategoryToApi } from '@/src/utils/signup/apiConverter';
import { categoryCodeToName } from '@/src/utils/myRecruitment';
import type { Category } from '@/src/types/recruitment';

/**
 * API 응답 → 폼 상태 변환
 */
export function mapProfileResponseToForm(profileResponse: ProfileResult): ProfileEditFormState {
  const { role, data } = profileResponse;

  const baseForm: ProfileEditFormState = {
    nickname: data.nickname ?? '',
    gender: convertGenderToDisplay(data.gender) || '',
    birthDate: data.birth ? data.birth.replace(/-/g, '.') : '',
    intro: '',
    storeName: '',
    address: '',
    detailAddress: '',
    category: '',
    profileImage: data.profileImageUrl ?? null,
  };

  if (role === 'designer') {
    const designerData = data as MypageDesignerProfile;
    return {
      ...baseForm,
      intro: designerData.intro ?? '',
      storeName: designerData.shop ?? '',
      address: designerData.address?.line1 ?? '',
      detailAddress: designerData.address?.line2 ?? '',
      category: categoryCodeToName(designerData.category as Category) ?? '',
    };
  }

  return baseForm;
}

/**
 * 폼 상태 → API 요청 변환 (모델)
 */
export function buildModelProfilePayload(form: ProfileEditFormState): MypageModelProfileUpdateRequest {
  return {
    nickname: form.nickname.trim(),
    gender: convertGenderToApi(form.gender),
    birth: form.birthDate.replace(/\./g, '-'),
    profileImageUrl: form.profileImage,
  };
}

/**
 * 폼 상태 → API 요청 변환 (디자이너)
 */
export function buildDesignerProfilePayload(form: ProfileEditFormState): MypageDesignerProfileUpdateRequest {
  return {
    nickname: form.nickname.trim(),
    gender: convertGenderToApi(form.gender),
    birth: form.birthDate.replace(/\./g, '-'),
    profileImageUrl: form.profileImage,
    intro: form.intro.trim(),
    shop: form.storeName.trim(),
    addressLine1: form.address.trim(),
    addressLine2: form.detailAddress.trim(),
    category: convertCategoryToApi(form.category),
  };
}

/**
 * 역할에 따라 적절한 payload 생성
 */
export function buildProfilePayload(
  form: ProfileEditFormState,
  role: UserRole
): MypageModelProfileUpdateRequest | MypageDesignerProfileUpdateRequest {
  return role === 'designer' ? buildDesignerProfilePayload(form) : buildModelProfilePayload(form);
}
