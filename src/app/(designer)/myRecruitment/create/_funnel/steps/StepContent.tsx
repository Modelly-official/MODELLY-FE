'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import CategorySelector from '@/src/components/myRecruitment/Form/CategorySelector';
import ContentInput from '@/src/components/myRecruitment/Form/ContentInput';
import GoalInputs from '@/src/components/myRecruitment/Form/GoalInputs';
import AgreementCheckboxes from '@/src/components/myRecruitment/Form/AgreementCheckboxes';
import ImageUploader from '@/src/components/myRecruitment/Form/ImageUploader';
import { useRecruitmentFormStore } from '@/src/stores/myRecruitment/useRecruitmentFormStore';

interface StepContentProps {
  goNext: () => void;
  goPrev: () => void;
}

export default function StepContent({ goNext, goPrev }: StepContentProps) {
  // Zustand store
  const {
    category,
    setCategory,
    subCategories,
    toggleSubCategory,
    content,
    setContent,
    notice,
    setNotice,
    goals,
    setGoal,
    agreeVideo,
    setAgreeVideo,
    agreeInsta,
    setAgreeInsta,
    agreeMosaic,
    setAgreeMosaic,
    etc,
    setEtc,
    imageFiles,
    imagePreviewUrls,
    addImageFiles,
    removeImageFile,
    setImagePreviewUrls,
  } = useRecruitmentFormStore();

  // 이미지 파일이 추가되면 미리보기 URL 생성
  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(urls);

    // 클린업: URL 해제
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles, setImagePreviewUrls]);

  // 등록 버튼 활성화 조건: 카테고리 + 내용 필수
  const isSubmitButtonEnabled = category !== null && content.trim().length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 영역 */}
      <div className="flex h-[51px] items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={goPrev}
          className="flex size-6 cursor-pointer items-center justify-center"
        >
          <Image src="/icons/common/arrow-left.svg" alt="뒤로가기" width={9} height={16} />
        </button>
        <h1 className="text-head-4-medium text-black">모집글 등록</h1>
        <div className="size-6" /> {/* 균형을 위한 빈 공간 */}
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 space-y-6 p-4 pb-24">
        {/* 카테고리 선택 */}
        <CategorySelector
          selectedCategory={category}
          selectedSubCategories={subCategories}
          onCategoryChange={setCategory}
          onSubCategoryToggle={toggleSubCategory}
        />

        {/* 내용 입력 */}
        <ContentInput
          label="내용"
          value={content}
          onChange={setContent}
          placeholder="시술 내용을 입력해 주세요"
          maxLength={500}
          required
          rows={5}
        />

        {/* 주의사항 입력 */}
        <ContentInput
          label="주의사항"
          value={notice}
          onChange={setNotice}
          placeholder="모델에게 전달할 주의사항을 입력해 주세요"
          maxLength={300}
          rows={3}
        />

        {/* 시술 목표 */}
        <GoalInputs goals={goals} onGoalChange={setGoal} />

        {/* 동의 항목 */}
        <AgreementCheckboxes
          agreeVideo={agreeVideo}
          agreeInsta={agreeInsta}
          agreeMosaic={agreeMosaic}
          onAgreeVideoChange={setAgreeVideo}
          onAgreeInstaChange={setAgreeInsta}
          onAgreeMosaicChange={setAgreeMosaic}
        />

        {/* 기타 입력 */}
        <ContentInput
          label="기타"
          value={etc}
          onChange={setEtc}
          placeholder="기타 전달 사항을 입력해 주세요"
          maxLength={200}
          rows={2}
        />

        {/* 이미지 업로드 */}
        <ImageUploader
          previewUrls={imagePreviewUrls}
          onImagesAdd={addImageFiles}
          onImageRemove={removeImageFile}
          maxImages={5}
        />
      </div>

      {/* 하단 등록 버튼 (Fixed) */}
      <div className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-[375px] bg-white px-4 py-3">
        <button
          type="button"
          onClick={goNext}
          disabled={!isSubmitButtonEnabled}
          className={`text-body-1-semibold w-full rounded-full py-4 ${
            isSubmitButtonEnabled
              ? 'cursor-pointer bg-gray-900 text-white'
              : 'cursor-not-allowed bg-gray-200 text-gray-600'
          }`}
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
