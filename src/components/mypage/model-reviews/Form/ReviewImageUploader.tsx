'use client';

import { useRef } from 'react';
import Image from 'next/image';
import CameraIcon from '@/public/icons/review/camera.svg';
import CloseIcon from '@/public/icons/common/close.svg';
import { useToast } from '@/src/hooks/common/useToast';
import { validateImageFiles } from '@/src/utils';

interface ReviewImageUploaderProps {
  previewUrls: string[];
  onImagesAdd: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  maxImages?: number;
}

export default function ReviewImageUploader({
  previewUrls,
  onImagesAdd,
  onImageRemove,
  maxImages = 3,
}: ReviewImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const { validFiles, errors } = validateImageFiles(Array.from(files));

    // 에러 메시지 표시 (첫 번째 에러만)
    if (errors.length > 0) {
      showToast(errors[0]);
    }

    // 유효한 파일만 추가
    const remainingSlots = maxImages - previewUrls.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length > 0) {
      onImagesAdd(filesToAdd);
    }

    // 슬롯 초과 알림
    if (validFiles.length > remainingSlots && remainingSlots > 0) {
      showToast(`최대 ${maxImages}장까지 업로드 가능합니다`);
    }

    e.target.value = '';
  };

  const canAddMore = previewUrls.length < maxImages;

  return (
    <div className="flex flex-col gap-3">
      {/* 라벨 */}
      <span className="text-body-1-medium text-black">
        사진 첨부 (최대 {maxImages}장)
      </span>

      {/* 이미지 목록 */}
      <div className="flex gap-2">
        {/* 이미지 미리보기들 */}
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className="relative h-[108px] w-[109px] shrink-0 overflow-hidden rounded-lg"
          >
            <Image
              src={url}
              alt={`업로드 이미지 ${index + 1}`}
              fill
              sizes="109px"
              className="object-cover"
              draggable={false}
            />
            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={() => onImageRemove(index)}
              className="absolute top-1 right-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-gray-900/60"
            >
              <CloseIcon className="size-2.5 text-white" />
            </button>
          </div>
        ))}

        {/* 추가 버튼 */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-[108px] w-[109px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg bg-gray-100"
          >
            <CameraIcon className="size-6 text-gray-600" />
            <span className="text-caption-1-medium text-gray-600">
              사진 추가하기
            </span>
          </button>
        )}
      </div>

      {/* 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
