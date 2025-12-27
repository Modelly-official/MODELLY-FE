'use client';

import { useRef } from 'react';
import Image from 'next/image';
import PlusIcon from '@/src/assets/icons/plus.svg';
import CloseSmallIcon from '@/public/icons/myRecruitment/form/close-small.svg';
import { useToast } from '@/src/hooks/common/useToast';

// 허용된 이미지 MIME 타입
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
// 최대 파일 크기 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface ImageUploaderProps {
  previewUrls: string[];
  onImagesAdd: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  maxImages?: number;
}

export default function ImageUploader({
  previewUrls,
  onImagesAdd,
  onImageRemove,
  maxImages = 3,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // MIME 타입 검증
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        errors.push(`${file.name}: 지원하지 않는 이미지 형식입니다`);
        return;
      }

      // 파일 크기 검증
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: 파일 크기가 5MB를 초과합니다`);
        return;
      }

      validFiles.push(file);
    });

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
    <div className="flex flex-col gap-2">
      {/* 라벨 */}
      <div className="flex items-center gap-1">
        <span className="text-body-1-semibold text-gray-900">사진 첨부</span>
        <span className="text-head-3-semibold text-purple-500">*</span>
      </div>

      {/* 이미지 목록 - 154x154 */}
      <div className="flex gap-2 overflow-x-auto">
        {/* 이미지 미리보기들 */}
        {previewUrls.map((url, index) => (
          <div key={index} className="relative size-[154px] shrink-0 overflow-hidden rounded-xl">
            <Image
              src={url}
              alt={`업로드 이미지 ${index + 1}`}
              fill
              className="object-cover"
              draggable={false}
            />
            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={() => onImageRemove(index)}
              className="absolute top-2 right-2 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/50"
            >
              <CloseSmallIcon />
            </button>
          </div>
        ))}

        {/* 추가 버튼 */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex size-[154px] shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gray-100"
          >
            <PlusIcon className="size-6" />
          </button>
        )}
      </div>

      {/* 안내 문구 */}
      <p className="text-body-2-medium text-gray-500">
        최대 {maxImages}장, 시술과 관련된 사진으로 첨부해주세요
      </p>

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
