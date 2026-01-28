'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import TextArea from '@/src/components/myRecruitment/Form/TextArea';
import Dropdown from '@/src/components/common/Dropdown/Dropdown';
import ImageUploader from '@/src/components/myRecruitment/Form/ImageUploader';
import TickSquareCheckbox from '@/src/components/myRecruitment/Form/TickSquareCheckbox';
import { useRecruitmentFormStore } from '@/src/stores/myRecruitment/useRecruitmentFormStore';
import { useIMEInput } from '@/src/hooks/custom/useIMEInput';
import { useImagePreview } from '@/src/hooks/custom/myRecruitment/useImagePreview';
import { PURPOSE_OPTIONS } from '@/src/types/myRecruitment';
import { getSubCategoryOptions } from '@/src/constants/explore';
import { getUserCategory } from '@/src/stores';
import { isStep2Valid } from '@/src/utils/myRecruitment';
import type { PurposeType } from '@/src/types/myRecruitment';
import { FixedBottomContainer } from '@/src/components/common/FixedBottomContainer';

interface StepContentProps {
  goNext: () => void;
  goPrev: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function StepContent({ goNext, goPrev, isSubmitting = false, isEdit = false }: StepContentProps) {
  // Zustand store
  const {
    content,
    setContent,
    subCategories,
    toggleSubCategory,
    restrictions,
    setRestrictions,
    notice,
    setNotice,
    purpose,
    setPurpose,
    purposeDetail,
    setPurposeDetail,
    agreeVideo,
    setAgreeVideo,
    agreeInsta,
    setAgreeInsta,
    agreeMosaic,
    setAgreeMosaic,
    agreeEtc,
    setAgreeEtc,
    etc,
    setEtc,
    imageFiles,
    imagePreviewUrls,
    addImageFiles,
    removeImageFile,
    setImagePreviewUrls,
  } = useRecruitmentFormStore();

  // IME 조합 처리 (한글 입력 시 focus 유지)
  const purposeDetailInput = useIMEInput(purposeDetail, setPurposeDetail);
  const etcInput = useIMEInput(etc, setEtc);

  // 그 외 textarea auto-expand ref
  const etcTextareaRef = useRef<HTMLTextAreaElement>(null);

  // 그 외 textarea auto-expand
  useEffect(() => {
    const textarea = etcTextareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [etcInput.value]);

  // 이미지 미리보기 URL 관리 (blob URL 생성/정리)
  useImagePreview({
    imageFiles,
    existingUrls: imagePreviewUrls,
    onUrlsChange: setImagePreviewUrls,
  });

  // 디자이너 카테고리에 맞는 서브카테고리 옵션
  const designerCategory = getUserCategory();
  const subCategoryOptions = designerCategory
    ? getSubCategoryOptions(designerCategory).map((opt) => ({ value: opt.code, label: opt.name }))
    : [];

  // 목적 옵션
  const purposeOptions = PURPOSE_OPTIONS.map((opt) => ({ value: opt.code, label: opt.name }));

  // 등록 버튼 활성화 조건
  const isSubmitButtonEnabled = isStep2Valid(
    { content, subCategories, restrictions, notice, imageFiles, imagePreviewUrls, purpose, purposeDetail },
    { isEditMode: isEdit },
  );

  return (
    <div className="flex min-h-screen flex-col bg-white pt-[env(safe-area-inset-top)]">
      {/* 헤더 영역 */}
      <div className="flex h-[52px] items-center justify-between px-4 py-3">
        <button type="button" onClick={goPrev} className="flex size-6 cursor-pointer items-center justify-center">
          <Image src="/icons/common/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="text-head-4-medium text-black">{isEdit ? '모집글 수정' : '모집글 등록'}</h1>
        <div className="size-6" />
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 space-y-7 p-4 pb-[150px]">
        {/* 시술 내용 */}
        <TextArea
          label="시술 내용"
          value={content}
          onChange={setContent}
          placeholder="시술 내용이나 전달사항을 입력해주세요"
          required
        />

        {/* 카테고리 선택 */}
        <Dropdown
          label="카테고리"
          required
          multiple
          placeholder="시술 카테고리를 선택해주세요"
          options={subCategoryOptions}
          value={subCategories}
          onChange={toggleSubCategory}
        />

        {/* 제한 사항 */}
        <TextArea
          label="제한 사항"
          value={restrictions}
          onChange={setRestrictions}
          placeholder="시술 시 제한 사항을 입력해주세요"
          required
        />

        {/* 전달 사항 */}
        <TextArea
          label="전달 사항"
          value={notice}
          onChange={setNotice}
          placeholder="시술 시 전달 사항을 입력해주세요"
          required
        />

        {/* 목적 */}
        <div className="flex flex-col gap-2">
          <Dropdown
            label="목적"
            placeholder="시술 목적을 선택하세요"
            options={purposeOptions}
            value={purpose}
            onChange={(value) => setPurpose(value as PurposeType)}
          />
          {/* 기타 선택 시 입력 필드 */}
          {purpose === 'OTHER' && (
            <input
              type="text"
              value={purposeDetailInput.value}
              onChange={purposeDetailInput.onChange}
              onCompositionStart={purposeDetailInput.onCompositionStart}
              onCompositionEnd={purposeDetailInput.onCompositionEnd}
              placeholder="목적을 작성해주세요"
              className="text-body-2-medium w-full rounded-xl bg-gray-100 px-4 py-[14px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:placeholder:text-transparent"
            />
          )}
        </div>

        {/* 사진 첨부 */}
        <ImageUploader
          previewUrls={imagePreviewUrls}
          onImagesAdd={addImageFiles}
          onImageRemove={removeImageFile}
          maxImages={3}
        />

        {/* 사전 동의 사항 */}
        <div className="flex flex-col gap-4">
          <span className="text-body-1-semibold text-gray-900">사전 동의 사항</span>
          <div className="flex flex-col gap-3">
            <TickSquareCheckbox label="영상 촬영" checked={agreeVideo} onChange={setAgreeVideo} />
            <TickSquareCheckbox label="인스타 업로드" checked={agreeInsta} onChange={setAgreeInsta} />
            <TickSquareCheckbox label="모자이크 가능" checked={agreeMosaic} onChange={setAgreeMosaic} />
            <div className="flex flex-col gap-2">
              <TickSquareCheckbox label="그 외(직접 작성)" checked={agreeEtc} onChange={setAgreeEtc} />
              {/* 그 외 선택 시 입력 필드 */}
              {agreeEtc && (
                <textarea
                  ref={etcTextareaRef}
                  value={etcInput.value}
                  onChange={etcInput.onChange}
                  onCompositionStart={etcInput.onCompositionStart}
                  onCompositionEnd={etcInput.onCompositionEnd}
                  placeholder="기타 동의 사항을 입력해주세요"
                  rows={1}
                  className="text-body-2-medium min-h-[49px] w-full resize-none overflow-hidden rounded-xl bg-gray-100 px-4 py-[14px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:placeholder:text-transparent"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 등록 버튼 (Fixed) */}
      <FixedBottomContainer hasBorder>
        <button
          type="button"
          onClick={goNext}
          disabled={!isSubmitButtonEnabled || isSubmitting}
          className={`text-body-1-semibold flex h-14 w-full items-center justify-center rounded-full ${
            isSubmitButtonEnabled && !isSubmitting
              ? 'cursor-pointer bg-gray-900 text-white'
              : 'cursor-not-allowed bg-gray-200 text-gray-500'
          }`}
        >
          {isSubmitting ? (
            <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            isEdit ? '모집글 수정' : '새 모집글 등록'
          )}
        </button>
      </FixedBottomContainer>
    </div>
  );
}
