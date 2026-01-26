'use client';

import { useEffect, useRef, useState } from 'react';
import PortfolioImageUploader from '@/src/components/mypage/portfolio/PortfolioImageUploader';
import Dropdown from '@/src/components/common/Dropdown/Dropdown';
import { useIMEInput } from '@/src/hooks/custom/useIMEInput';

const MAX_TITLE_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 25;

interface SubCategoryOption {
  value: string;
  label: string;
}

interface PortfolioFormProps {
  submitLabel: string;
  subCategoryOptions: SubCategoryOption[];
  initialTitle?: string;
  initialDescription?: string;
  initialImageUrl?: string | null;
  initialSubCategory?: string | null;
  onSubmit: (payload: {
    title: string;
    description: string;
    imageFile: File | null;
    imagePreviewUrl: string | null;
    subCategory: string;
  }) => void;
}

export default function PortfolioForm({
  submitLabel,
  subCategoryOptions,
  initialTitle = '',
  initialDescription = '',
  initialImageUrl = null,
  initialSubCategory = null,
  onSubmit,
}: PortfolioFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(initialImageUrl);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [subCategory, setSubCategory] = useState<string | null>(initialSubCategory);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const titleInput = useIMEInput(title, setTitle, { maxLength: MAX_TITLE_LENGTH });
  const descriptionInput = useIMEInput(description, setDescription, { maxLength: MAX_DESCRIPTION_LENGTH });

  useEffect(() => {
    if (imagePreviewUrl?.startsWith('blob:')) {
      return () => {
        URL.revokeObjectURL(imagePreviewUrl);
      };
    }
    return undefined;
  }, [imagePreviewUrl]);

  useEffect(() => {
    const textarea = descriptionRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  }, [descriptionInput.value]);

  const handleImageSelect = (file: File) => {
    if (imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    const nextPreviewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreviewUrl(nextPreviewUrl);
  };

  const isSubmitEnabled = Boolean((imageFile || imagePreviewUrl) && title.trim() && description.trim() && subCategory);

  const handleSubmit = () => {
    if (!isSubmitEnabled || !subCategory) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      imageFile,
      imagePreviewUrl,
      subCategory,
    });
  };

  const subCategoryPlaceholder =
    subCategoryOptions.length > 0 ? '카테고리를 선택해주세요' : '카테고리 정보를 불러오는 중입니다.';

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-[29px]">
        <PortfolioImageUploader previewUrl={imagePreviewUrl} onImageSelect={handleImageSelect} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-body-1-medium text-gray-900">포트폴리오 제목</span>
            <input
              type="text"
              value={titleInput.value}
              onChange={titleInput.onChange}
              onCompositionStart={titleInput.onCompositionStart}
              onCompositionEnd={titleInput.onCompositionEnd}
              placeholder="20자 이하로 작성해주세요"
              className="text-body-2-medium w-full rounded-[10px] bg-gray-100 px-4 py-3.5 text-gray-900 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-body-1-medium text-gray-900">시술 상세 내용</span>
            <textarea
              ref={descriptionRef}
              value={descriptionInput.value}
              onChange={descriptionInput.onChange}
              onCompositionStart={descriptionInput.onCompositionStart}
              onCompositionEnd={descriptionInput.onCompositionEnd}
              placeholder="25자 이내로 작성해주세요"
              rows={1}
              className="text-body-2-medium w-full resize-none overflow-hidden rounded-[10px] bg-gray-100 px-4 py-3.5 text-gray-900 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent"
            />
          </div>

          <div className="focus-within:pb-24">
            <Dropdown
              label="세부 카테고리"
              options={subCategoryOptions}
              value={subCategory}
              onChange={setSubCategory}
              placeholder={subCategoryPlaceholder}
              disabled={subCategoryOptions.length === 0}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 bg-white px-4 py-3 sm:w-[375px]">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isSubmitEnabled}
          className={`text-body-1-semibold flex w-full items-center justify-center rounded-full py-4 ${
            isSubmitEnabled ? 'cursor-pointer bg-gray-900 text-white' : 'cursor-not-allowed bg-gray-200 text-gray-500'
          }`}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
