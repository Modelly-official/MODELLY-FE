'use client';

import { useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import TextArea from '@/src/components/myRecruitment/Form/TextArea';
import Dropdown from '@/src/components/myRecruitment/Form/Dropdown';
import ImageUploader from '@/src/components/myRecruitment/Form/ImageUploader';
import TickSquareCheckbox from '@/src/components/myRecruitment/Form/TickSquareCheckbox';
import { useRecruitmentFormStore } from '@/src/stores/myRecruitment/useRecruitmentFormStore';
import { useIMEInput } from '@/src/hooks/custom/useIMEInput';
import { PURPOSE_OPTIONS } from '@/src/types/myRecruitment';
import { RECRUITMENT_CATEGORY_OPTIONS } from '@/src/constants/explore';
import type { PurposeType } from '@/src/types/myRecruitment';

interface StepContentProps {
  goNext: () => void;
  goPrev: () => void;
}

export default function StepContent({ goNext, goPrev }: StepContentProps) {
  // Zustand store
  const {
    content,
    setContent,
    subCategory,
    setSubCategory,
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

  // 각 파일의 고유 키를 생성하여 파일 변경 감지
  const imageFilesKey = useMemo(
    () => imageFiles.map((f) => `${f.name}-${f.size}-${f.lastModified}`).join(','),
    [imageFiles]
  );

  // 이미지 파일이 추가/변경되면 미리보기 URL 생성
  useEffect(() => {
    // 이전 URL들 revoke
    imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));

    if (imageFiles.length === 0) {
      setImagePreviewUrls([]);
      return;
    }

    // 새 URL 생성
    const newUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(newUrls);

    // cleanup: 컴포넌트 언마운트 시 URL revoke
    return () => {
      newUrls.forEach((url) => URL.revokeObjectURL(url));
    };
    // imageFilesKey를 의존성으로 사용하여 파일 교체도 감지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFilesKey]);

  // 목적 옵션
  const purposeOptions = PURPOSE_OPTIONS.map((opt) => ({ code: opt.code, name: opt.name }));

  // 등록 버튼 활성화 조건
  const isSubmitButtonEnabled =
    content.trim().length > 0 &&
    subCategory !== null &&
    restrictions.trim().length > 0 &&
    notice.trim().length > 0 &&
    imageFiles.length > 0 &&
    // purpose가 OTHER인 경우 purposeDetail 필수
    (purpose !== 'OTHER' || purposeDetail.trim().length > 0);

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
        <div className="size-6" />
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 space-y-7 p-4 pb-24">
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
          placeholder="시술 카테고리를 선택해주세요"
          options={[...RECRUITMENT_CATEGORY_OPTIONS]}
          value={subCategory}
          onChange={setSubCategory}
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
        <div className="flex flex-col gap-2">
          <span className="text-body-1-semibold text-gray-900">사전 동의 사항</span>
          <div className="flex flex-col gap-3">
            <TickSquareCheckbox
              label="영상 촬영"
              checked={agreeVideo}
              onChange={setAgreeVideo}
            />
            <TickSquareCheckbox
              label="인스타 업로드"
              checked={agreeInsta}
              onChange={setAgreeInsta}
            />
            <TickSquareCheckbox
              label="모자이크 가능"
              checked={agreeMosaic}
              onChange={setAgreeMosaic}
            />
            <div className="flex flex-col gap-2">
              <TickSquareCheckbox
                label="그 외(직접 작성)"
                checked={agreeEtc}
                onChange={setAgreeEtc}
              />
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
      <div className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-[375px] border-t border-gray-100 bg-white px-4 pb-2 pt-3">
        <button
          type="button"
          onClick={goNext}
          disabled={!isSubmitButtonEnabled}
          className={`text-body-1-semibold w-full rounded-full py-4 ${
            isSubmitButtonEnabled
              ? 'cursor-pointer bg-gray-900 text-white'
              : 'cursor-not-allowed bg-gray-200 text-gray-500'
          }`}
        >
          새 모집글 등록
        </button>
      </div>
    </div>
  );
}
