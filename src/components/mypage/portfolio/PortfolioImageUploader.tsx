'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useToast } from '@/src/hooks/common/useToast';
import { validateImageFile } from '@/src/utils';

interface PortfolioImageUploaderProps {
  previewUrl: string | null;
  onImageSelect: (file: File) => void;
}

export default function PortfolioImageUploader({ previewUrl, onImageSelect }: PortfolioImageUploaderProps) {
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

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {previewUrl ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-gray-300">
          <Image
            src={previewUrl}
            alt="포트폴리오 이미지"
            fill
            sizes="(max-width: 768px) calc(100vw - 32px), 400px"
            className="object-cover"
            draggable={false}
          />
          <button
            type="button"
            onClick={handleOpenFile}
            className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center"
          >
            <span className="text-body-2-medium rounded-full border border-gray-400 bg-white px-3 py-2 text-gray-900">
              이미지 수정
            </span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOpenFile}
          className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-[20px] bg-gray-100"
        >
          <span className="text-body-2-medium rounded-full border border-gray-400 bg-white px-3 py-2 text-gray-900">
            사진 업로드
          </span>
        </button>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  );
}
