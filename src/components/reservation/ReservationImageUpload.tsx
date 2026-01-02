'use client';

import { useRef } from 'react';
import Image from 'next/image';
import CameraIcon from '@/public/icons/reservation/camera.svg';
import DeleteIcon from '@/public/icons/reservation/delete.svg';
import { useToast } from '@/src/hooks/common/useToast';
import { validateImageFile } from '@/src/utils';

interface ReservationImageUploadProps {
  /** 이미지 미리보기 URL */
  previewUrl: string | null;
  /** 이미지 선택 시 호출 */
  onImageSelect: (file: File) => void;
  /** 이미지 삭제 시 호출 */
  onImageRemove: () => void;
}

/**
 * 예약 이미지 업로드 컴포넌트
 * - 단일 이미지만 업로드 가능
 * - 정사각형 영역 클릭하여 이미지 선택
 * - 삭제 버튼으로 이미지 제거
 */
export default function ReservationImageUpload({
  previewUrl,
  onImageSelect,
  onImageRemove,
}: ReservationImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = validateImageFile(file);
    if (!result.isValid && result.error) {
      showToast(result.error);
      e.target.value = '';
      return;
    }

    onImageSelect(file);
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* 이미지 업로드 영역 */}
      {previewUrl ? (
        /* 이미지 미리보기 */
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
          <Image
            src={previewUrl}
            alt="업로드된 이미지"
            fill
            sizes="100vw"
            className="object-cover"
            draggable={false}
          />
          {/* 삭제 버튼 */}
          <button
            type="button"
            onClick={onImageRemove}
            className="absolute right-3 top-3 cursor-pointer"
            aria-label="이미지 삭제"
          >
            <DeleteIcon className="size-[39px]" />
          </button>
        </div>
      ) : (
        /* 업로드 버튼 */
        <button
          type="button"
          onClick={handleClick}
          className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[20px] bg-gray-100"
        >
          <CameraIcon className="size-[35px]" />
          <span className="text-body-2-medium text-gray-600">사진 업로드</span>
        </button>
      )}

      {/* 파일 입력 (숨김) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
