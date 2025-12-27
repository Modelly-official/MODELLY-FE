'use client';

import { useRef } from 'react';
import Image from 'next/image';

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
  maxImages = 5,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = maxImages - previewUrls.length;
      const filesToAdd = Array.from(files).slice(0, remainingSlots);
      if (filesToAdd.length > 0) {
        onImagesAdd(filesToAdd);
      }
    }
    // 같은 파일 재선택 가능하도록 리셋
    e.target.value = '';
  };

  const canAddMore = previewUrls.length < maxImages;

  return (
    <div className="flex flex-col gap-2">
      {/* 라벨 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-body-1-semibold text-gray-900">사진</span>
        </div>
        <span className="text-body-2-regular text-gray-600">
          {previewUrls.length}/{maxImages}
        </span>
      </div>

      {/* 이미지 목록 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {/* 추가 버튼 */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex size-20 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-400 bg-gray-100"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="#8B8D94"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* 이미지 미리보기들 */}
        {previewUrls.map((url, index) => (
          <div key={index} className="relative size-20 shrink-0">
            <Image
              src={url}
              alt={`업로드 이미지 ${index + 1}`}
              fill
              className="rounded-xl object-cover"
              draggable={false}
            />
            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={() => onImageRemove(index)}
              className="absolute -top-2 -right-2 flex size-6 cursor-pointer items-center justify-center rounded-full bg-gray-900"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 3L3 9M3 3L9 9"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {/* 첫 번째 이미지 = 대표 이미지 표시 */}
            {index === 0 && (
              <div className="text-caption-2-regular absolute bottom-0 left-0 right-0 rounded-b-xl bg-black/50 py-1 text-center text-white">
                대표
              </div>
            )}
          </div>
        ))}
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
