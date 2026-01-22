'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import { AddressInput, FixedBottomButton, GenderSelect, ProfileImageUpload } from '@/src/components/signup';
import { Dropdown, TextInput } from '@/src/components/common';
import { useProfileEditForm } from '@/src/hooks/custom/mypage';
import { CATEGORY_OPTIONS } from '@/src/constants/mypage';

export default function ProfileEditPage() {
  const router = useRouter();
  const {
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
    isLoading,
    isUploading,
    // 검증 및 제출
    isFormValid,
    handleSubmit,
  } = useProfileEditForm();

  // 비로그인 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (authReady && !isLoggedIn) {
      router.replace('/login');
    }
  }, [authReady, isLoggedIn, router]);

  // 로딩 중이거나 비로그인 상태
  if (!authReady || !isLoggedIn) return null;

  const isDesigner = currentRole === 'designer';
  const isButtonLoading = isUploading || isLoading;

  return (
    <div className="flex min-h-screen flex-col bg-white pt-[env(safe-area-inset-top)]">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          aria-label="이전으로"
          onClick={() => router.push('/mypage')}
          className="flex size-6 cursor-pointer items-center justify-center"
        >
          <ArrowLeftIcon className="size-6" />
        </button>
        <h1 className="text-head-4-medium text-black">프로필 수정</h1>
        {/* 균형을 위한 빈 공간 */}
        <div className="size-6" />
      </header>

      {/* 폼 */}
      <form
        className="mx-4 mt-4 flex w-[calc(100%-2rem)] flex-1 flex-col gap-6 pb-6 sm:w-[343px]"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* 프로필 이미지 */}
        <ProfileImageUpload
          profileImage={form.profileImage}
          onImageUpload={handleImageUpload}
        />

        <div className="flex flex-col gap-6">
          {/* 닉네임 */}
          <TextInput
            label={isDesigner ? '디자이너 활동명' : '닉네임'}
            value={form.nickname}
            onChange={(value) => updateField('nickname', value)}
            placeholder="활동명을 입력해주세요"
            maxLength={20}
            showClearButton
          />

          {/* 성별 */}
          <GenderSelect
            value={form.gender}
            onChange={(value) => updateField('gender', value)}
          />

          {/* 생년월일 */}
          <div className="flex flex-col gap-2">
            <label className="text-body-1-medium text-gray-900">생년월일</label>
            <input
              type="text"
              className="text-body-2-medium rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent"
              placeholder="생년월일을 입력해주세요"
              value={form.birthDate}
              onChange={(e) => updateBirthDate(e.target.value)}
              maxLength={10}
            />
          </div>

          {/* 디자이너 전용 필드 */}
          {isDesigner && (
            <>
              {/* 한 줄 소개 */}
              <div className="relative flex flex-col gap-2">
                <label className="text-body-1-medium text-gray-900">한 줄 소개</label>
                <textarea
                  value={form.intro}
                  onChange={(e) => updateField('intro', e.target.value.slice(0, 100))}
                  placeholder="디자이너 서비스를 소개해주세요"
                  maxLength={100}
                  className="text-body-2-medium h-[120px] w-full resize-none overflow-y-auto rounded-xl bg-gray-100 px-4 py-3.5 text-gray-900 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent"
                />
                <span className="text-body-2-medium absolute right-4 bottom-3 text-gray-600">
                  {form.intro.length}/100
                </span>
              </div>

              {/* 매장 이름 */}
              <TextInput
                label="매장 이름"
                value={form.storeName}
                onChange={(value) => updateField('storeName', value)}
                placeholder="매장 이름을 입력해주세요"
                maxLength={20}
              />

              {/* 주소 */}
              <AddressInput
                address={form.address}
                detailAddress={form.detailAddress}
                onAddressSearch={(value) => updateField('address', value)}
                onDetailAddressChange={(value) => updateField('detailAddress', value)}
              />

              {/* 카테고리 */}
              <Dropdown
                label="카테고리"
                value={form.category || null}
                onChange={(value) => updateField('category', value ?? '')}
                placeholder="헤어/네일/타투/속눈썹"
                options={[...CATEGORY_OPTIONS]}
              />
            </>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="mt-auto mb-3">
          <FixedBottomButton
            disabled={!isFormValid || isLoading}
            onClick={handleSubmit}
          >
            {isButtonLoading ? (
              <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              '완료'
            )}
          </FixedBottomButton>
        </div>
      </form>
    </div>
  );
}
