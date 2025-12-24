'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PostHeader } from '../Header';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex] = useState(0);

  // 빈 배열 처리
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[375px] w-full">
      {/* 헤더 */}
      <PostHeader />
      {/* 이미지 */}
      <div className="relative size-full">
        <Image src={images[currentIndex]} alt={`공고 이미지 ${currentIndex + 1}`} fill className="object-cover" />
      </div>

      {/* 이미지 카운터 */}
      <div className="absolute right-4 bottom-4 rounded-full bg-black/60 px-3 py-1">
        <span className="text-body-2-medium text-white">
          {currentIndex + 1}/{images.length}
        </span>
      </div>

      {/* TODO: 이미지 슬라이더 기능 추가 (추후 구현) */}
    </div>
  );
}
