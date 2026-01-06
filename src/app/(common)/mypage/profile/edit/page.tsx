'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LeftArrowIcon from '@/public/icons/common/left-arrow.svg';
import { AddressInput, FixedBottomButton, GenderSelect, ProfileImageUpload } from '@/src/components/signup';
import { Dropdown, TextInput } from '@/src/components/common';
import { uploadProfileImage } from '@/src/apis';
import { useDesignerProfile, useModelProfile, useUpdateDesignerProfile, useUpdateModelProfile } from '@/src/hooks/queries';
import { formatBirthDate, showToast } from '@/src/utils';
import { convertCategoryToApi, convertGenderToApi } from '@/src/utils/signup/apiConverter';
import { convertGenderToDisplay } from '@/src/utils/signup/profileFormat';
import { getUserCategory, getUserRole, useAuthStore } from '@/src/stores';
import type { Category } from '@/src/types/recruitment';

type ProfileFormState = {
  nickname: string;
  gender: string;
  birthDate: string;
  intro: string;
  storeName: string;
  address: string;
  detailAddress: string;
  category: string;
  profileImage: string | null;
};

const CATEGORY_CODE_TO_LABEL: Record<Category, string> = {
  HAIR: '헤어',
  NAIL: '네일',
  TATTOO: '타투',
  EYELASH: '속눈썹',
};

const CATEGORY_OPTIONS = [
  { value: '헤어', label: '헤어' },
  { value: '네일', label: '네일' },
  { value: '타투', label: '타투' },
  { value: '속눈썹', label: '속눈썹' },
];

const mapCategoryToLabel = (category?: Category | null) => {
  if (!category) return '';
  return CATEGORY_CODE_TO_LABEL[category] ?? '';
};

export default function ProfileEditPage() {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const [role, setRole] = useState<'model' | 'designer'>('model');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const isDesigner = role === 'designer';

  const [form, setForm] = useState<ProfileFormState>({
    nickname: authUser?.username ?? '',
    gender: '',
    birthDate: '',
    intro: '',
    storeName: '',
    address: '',
    detailAddress: '',
    category: mapCategoryToLabel(authUser?.category ?? getUserCategory()),
    profileImage: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { data: modelProfile, isLoading: isModelLoading } = useModelProfile(authChecked && isLoggedIn && !isDesigner);
  const { data: designerProfile, isLoading: isDesignerLoading } = useDesignerProfile(
    authChecked && isLoggedIn && isDesigner,
  );
  const isProfileLoading = isModelLoading || isDesignerLoading;
  const updateModelProfileMutation = useUpdateModelProfile();
  const updateDesignerProfileMutation = useUpdateDesignerProfile();

  useEffect(() => {
    const cookieRole = getUserRole();
    setRole((authUser?.role ?? cookieRole ?? 'model') as 'model' | 'designer');
    setIsLoggedIn(!!(authUser ?? cookieRole));
    setAuthChecked(true);
  }, [authUser]);

  useEffect(() => {
    if (authChecked && !isLoggedIn) {
      router.replace('/login');
    }
  }, [authChecked, isLoggedIn, router]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      nickname: authUser?.username ?? prev.nickname,
      category: mapCategoryToLabel(authUser?.category ?? getUserCategory()) || prev.category,
    }));
  }, [authUser]);

  useEffect(() => {
    if (!isLoggedIn) return;

    if (!isDesigner && modelProfile?.result) {
      const { nickname, gender, birth, profileImageUrl } = modelProfile.result;
      setForm((prev) => ({
        ...prev,
        nickname: nickname ?? prev.nickname,
        gender: convertGenderToDisplay(gender) || prev.gender,
        birthDate: birth ? birth.replace(/-/g, '.') : prev.birthDate,
        profileImage: profileImageUrl || null,
      }));
    }

    if (isDesigner && designerProfile?.result) {
      const { nickname, gender, birth, intro, shop, address, category, profileImageUrl } = designerProfile.result;
      setForm((prev) => ({
        ...prev,
        nickname: nickname ?? prev.nickname,
        gender: convertGenderToDisplay(gender) || prev.gender,
        birthDate: birth ? birth.replace(/-/g, '.') : prev.birthDate,
        intro: intro ?? prev.intro,
        storeName: shop ?? prev.storeName,
        address: address?.line1 ?? prev.address,
        detailAddress: address?.line2 ?? prev.detailAddress,
        category: category ?? prev.category,
        profileImage: profileImageUrl || null,
      }));
    }
  }, [designerProfile, isDesigner, isLoggedIn, modelProfile]);

  const handleFieldChange = (key: keyof ProfileFormState, value: string | null) => {
    setForm((prev) => ({ ...prev, [key]: value ?? '' }));
  };

  const handleBirthDateChange = (value: string) => {
    handleFieldChange('birthDate', formatBirthDate(value));
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const imageUrl = await uploadProfileImage(file);
      handleFieldChange('profileImage', imageUrl);
      showToast('이미지가 업로드되었습니다.');
    } catch (error) {
      console.error('이미지 업로드 에러:', error);
      showToast('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const nicknameTrimmed = form.nickname.trim();
  const introTrimmed = form.intro.trim();
  const storeNameTrimmed = form.storeName.trim();
  const addressTrimmed = form.address.trim();

  if (!authChecked) return null;
  if (!isLoggedIn) return null;

  const isFormValid = isDesigner
    ? nicknameTrimmed &&
      form.gender &&
      form.birthDate &&
      introTrimmed &&
      storeNameTrimmed &&
      addressTrimmed &&
      form.category
    : nicknameTrimmed && form.gender && form.birthDate;

  const handleSubmit = async () => {
    if (!isFormValid || isSaving || isUploading || isProfileLoading) return;

    const birthApi = form.birthDate.replace(/\./g, '-');
    const genderApi = convertGenderToApi(form.gender);

    setIsSaving(true);
    try {
      if (isDesigner) {
        const payload = {
          nickname: nicknameTrimmed,
          gender: genderApi,
          birth: birthApi,
          intro: introTrimmed,
          shop: storeNameTrimmed,
          addressLine1: addressTrimmed,
          addressLine2: form.detailAddress.trim(),
          category: convertCategoryToApi(form.category),
          profileImageUrl: form.profileImage,
        };
        await updateDesignerProfileMutation.mutateAsync(payload);
      } else {
        const payload = {
          nickname: nicknameTrimmed,
          gender: genderApi,
          birth: birthApi,
          profileImageUrl: form.profileImage,
        };
        await updateModelProfileMutation.mutateAsync(payload);
      }
      router.back();
    } catch (error) {
      console.error('프로필 저장 에러:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white pt-[env(safe-area-inset-top)]">
      <header className="relative flex items-center justify-center px-4 py-3">
        <button
          type="button"
          aria-label="이전으로"
          onClick={() => router.back()}
          className="absolute left-4 flex h-10 w-10 cursor-pointer items-center justify-center"
        >
          <LeftArrowIcon />
        </button>
        <h1 className="text-head-4-medium text-gray-900">프로필 수정</h1>
      </header>

      <form
        className="mx-4 mt-4 flex w-[calc(100%-2rem)] flex-1 flex-col gap-6 pb-6 sm:w-[343px]"
        onSubmit={(e) => e.preventDefault()}
      >
        <ProfileImageUpload profileImage={form.profileImage} onImageUpload={handleImageUpload} />

        <div className="flex flex-col gap-6">
          <TextInput
            label={isDesigner ? '디자이너 활동명' : '닉네임'}
            value={form.nickname}
            onChange={(value) => handleFieldChange('nickname', value)}
            placeholder="활동명을 입력해주세요"
            maxLength={20}
            showClearButton
          />

          <GenderSelect value={form.gender} onChange={(value) => handleFieldChange('gender', value)} />

          <div className="flex flex-col gap-2">
            <label className="text-body-1-medium text-gray-900">생년월일</label>
            <input
              type="text"
              className="text-body-2-medium rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent"
              placeholder="생년월일을 입력해주세요"
              value={form.birthDate}
              onChange={(e) => handleBirthDateChange(e.target.value)}
              maxLength={10}
            />
          </div>

          {isDesigner && (
            <>
              <div className="relative flex flex-col gap-2">
                <label className="text-body-1-medium text-gray-900">한 줄 소개</label>
                <textarea
                  value={form.intro}
                  onChange={(e) => handleFieldChange('intro', e.target.value.slice(0, 100))}
                  placeholder="디자이너 서비스를 소개해주세요"
                  maxLength={100}
                  className="text-body-2-medium h-[120px] w-full resize-none overflow-y-auto rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent"
                />
                <span className="text-body-2-medium absolute right-4 bottom-3 text-gray-600">
                  {form.intro.length}/100
                </span>
              </div>

              <TextInput
                label="매장 이름"
                value={form.storeName}
                onChange={(value) => handleFieldChange('storeName', value)}
                placeholder="매장 이름을 입력해주세요"
                maxLength={20}
              />

              <AddressInput
                address={form.address}
                detailAddress={form.detailAddress}
                onAddressSearch={(value) => handleFieldChange('address', value)}
                onDetailAddressChange={(value) => handleFieldChange('detailAddress', value)}
              />

              <Dropdown
                label="카테고리"
                value={form.category || null}
                onChange={(value) => handleFieldChange('category', value)}
                placeholder="헤어/네일/타투/속눈썹"
                options={CATEGORY_OPTIONS}
              />
            </>
          )}
        </div>

        <div className="mt-auto mb-3">
          <FixedBottomButton
            disabled={!isFormValid || isSaving || isUploading || isProfileLoading}
            onClick={handleSubmit}
          >
            {isUploading ? '이미지 업로드 중...' : isSaving || isProfileLoading ? '저장 중...' : '완료'}
          </FixedBottomButton>
        </div>
      </form>
    </div>
  );
}
