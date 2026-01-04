'use client';

import { useState } from 'react';
import {
  SignupHeader,
  SignupTitle,
  FixedBottomButton,
  GenderSelect,
  AddressInput,
  ProfileImageUpload,
} from '@/src/components/signup';
import { TextInput, Dropdown } from '@/src/components/common';
import { useSignupStore } from '@/src/stores';
import { useSignup, useSocialSignup } from '@/src/hooks/queries';
import { formatBirthDate, formatAddressLines, convertGenderToApi, convertCategoryToApi, showToast } from '@/src/utils';
import { uploadProfileImage } from '@/src/apis';
import { SIGNUP_STEPS, SIGNUP_MESSAGES } from '@/src/constants/signup';
import type { SignupStepProps } from '@/src/types';
import type { SignupRequest, SocialSignupRequest } from '@/src/types';

interface StepProfileInfoProps extends SignupStepProps {
  goPrev: () => void;
}

export const StepProfileInfo: React.FC<StepProfileInfoProps> = ({ goPrev, goNext, isSocial = false }) => {
  const {
    role,
    nickname,
    gender,
    birthDate,
    intro,
    storeName,
    address,
    detailAddress,
    category,
    profileImage,
    username,
    password,
    email,
    name,
    phoneNumber,
    setField,
    setProfileImage,
  } = useSignupStore();

  const signupMutation = useSignup();
  const socialSignupMutation = useSocialSignup();
  const [isUploading, setIsUploading] = useState(false);

  // 프로필 이미지 업로드
  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const imageUrl = await uploadProfileImage(file);
      setProfileImage(imageUrl);
      showToast('이미지가 업로드되었습니다.');
    } catch (error) {
      console.error('이미지 업로드 에러:', error);
      showToast('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 주소 검색 결과 처리
  const handleAddressSearch = (fullAddress: string) => {
    setField('address', fullAddress);
  };

  // 생년월일 입력 처리
  const handleBirthDateChange = (value: string) => {
    setField('birthDate', formatBirthDate(value));
  };

  const isDesigner = role === 'designer';
  const nicknameTrimmed = nickname.trim();
  const introTrimmed = intro.trim();
  const storeNameTrimmed = storeName.trim();

  // 폼 유효성 검사
  const isFormValid = isDesigner
    ? nicknameTrimmed && gender && birthDate && introTrimmed && storeNameTrimmed && address && category
    : nicknameTrimmed && gender && birthDate;

  const isSubmitting = isSocial ? socialSignupMutation.isPending : signupMutation.isPending;

  const handleSubmit = () => {
    if (!isFormValid || isSubmitting || isUploading) return;

    const { addressLine1, addressLine2 } = formatAddressLines(address, detailAddress);

    // 소셜 회원가입
    if (isSocial) {
      const socialSignupData: SocialSignupRequest = {
        base: {
          phoneNum: phoneNumber.replace(/-/g, ''),
          gender: convertGenderToApi(gender),
          birth: birthDate.replace(/\./g, '-'),
          userRole: isDesigner ? 'DESIGNER' : 'MODEL',
          imageUrl: profileImage || '',
        },
        ...(isDesigner
          ? {
              designer: {
                shop: storeName,
                intro: intro,
                addressLine1: addressLine1,
                addressLine2: addressLine2 || '',
                category: convertCategoryToApi(category),
                nickname: nickname,
              },
            }
          : {
              model: {
                nickname: nickname,
              },
            }),
      };

      socialSignupMutation.mutate(socialSignupData, {
        onSuccess: (response) => {
          if (response.isSuccess) {
            goNext();
          } else {
            showToast(response.message || '회원가입 실패');
          }
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage = axiosError.response?.data?.message || '회원가입 오류';
          showToast(errorMessage);
        },
      });
    }
    // 일반 회원가입
    else {
      const signupData: SignupRequest = {
        base: {
          loginId: username,
          password: password,
          email: email,
          name: name,
          phoneNum: phoneNumber.replace(/-/g, ''),
          gender: convertGenderToApi(gender),
          birth: birthDate.replace(/\./g, '-'),
          userRole: isDesigner ? 'DESIGNER' : 'MODEL',
          imageUrl: profileImage || '',
        },
        ...(isDesigner
          ? {
              designer: {
                shop: storeName,
                intro: intro,
                addressLine1: addressLine1,
                addressLine2: addressLine2 || '',
                category: convertCategoryToApi(category),
                nickname: nickname,
              },
            }
          : {
              model: {
                nickname: nickname,
              },
            }),
      };

      signupMutation.mutate(signupData, {
        onSuccess: (response) => {
          if (response.isSuccess) {
            goNext();
          } else {
            showToast(response.message || '회원가입 실패');
          }
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage = axiosError.response?.data?.message || '회원가입 오류';
          showToast(errorMessage);
        },
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SignupHeader
        onBack={goPrev}
        totalSteps={isSocial ? SIGNUP_STEPS.SOCIAL : SIGNUP_STEPS.REGULAR}
        currentStep={isSocial ? SIGNUP_STEPS.SOCIAL : SIGNUP_STEPS.REGULAR}
      />
      <SignupTitle line1={SIGNUP_MESSAGES.PROFILE_INFO.TITLE_1} line2={SIGNUP_MESSAGES.PROFILE_INFO.TITLE_2} />

      <form
        className="mx-4 mt-10 flex w-[calc(100%-2rem)] flex-1 flex-col gap-6 sm:w-[343px]"
        onSubmit={(e) => e.preventDefault()}
      >
        <ProfileImageUpload profileImage={profileImage} onImageUpload={handleImageUpload} />
        <div className="flex flex-col gap-6">
          <TextInput
            label={isDesigner ? '디자이너 활동명' : '닉네임'}
            value={nickname}
            onChange={(value) => setField('nickname', value)}
            placeholder="활동명을 입력해주세요"
            maxLength={20}
            showClearButton
          />
          <GenderSelect value={gender} onChange={(value) => setField('gender', value)} />
          <div className="flex flex-col gap-2">
            <label className="text-body-1-medium text-gray-900">생년월일</label>
            <input
              type="text"
              className="text-body-2-medium rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent"
              placeholder="생년월일을 입력해주세요"
              value={birthDate}
              onChange={(e) => handleBirthDateChange(e.target.value)}
              maxLength={10}
            />
          </div>

          {/* 디자이너 용 필드들 */}
          {isDesigner && (
            <>
              <div className="relative flex flex-col gap-2">
                <label className="text-body-1-semibold text-gray-900">한 줄 소개</label>
                <textarea
                  value={intro}
                  onChange={(e) => setField('intro', e.target.value.slice(0, 100))}
                  placeholder="디자이너 서비스를 소개해주세요"
                  maxLength={100}
                  className="text-body-2-medium h-[120px] w-full resize-none overflow-y-auto rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent"
                />
                <span className="text-body-2-medium absolute right-4 bottom-3 text-gray-600">
                  {intro.length}/100
                </span>
              </div>
              <TextInput
                label="매장 이름"
                value={storeName}
                onChange={(value) => setField('storeName', value)}
                placeholder="매장 이름을 입력해주세요"
                maxLength={20}
              />
              <AddressInput
                address={address}
                detailAddress={detailAddress}
                onAddressSearch={handleAddressSearch}
                onDetailAddressChange={(value) => setField('detailAddress', value)}
              />
              <Dropdown
                label="카테고리"
                value={category}
                onChange={(value) => setField('category', value)}
                placeholder="헤어/네일/타투/속눈썹"
                options={[
                  { value: '헤어', label: '헤어' },
                  { value: '네일', label: '네일' },
                  { value: '타투', label: '타투' },
                  { value: '속눈썹', label: '속눈썹' },
                ]}
              />
            </>
          )}
        </div>

        <div className={`mb-3 ${isDesigner ? 'mt-[45px]' : 'mt-auto'}`}>
          <FixedBottomButton disabled={!isFormValid || isSubmitting || isUploading} onClick={handleSubmit}>
            {isUploading ? '이미지 업로드 중...' : isSubmitting ? '처리 중...' : SIGNUP_MESSAGES.BUTTON.NEXT}
          </FixedBottomButton>
        </div>
      </form>
    </div>
  );
};
