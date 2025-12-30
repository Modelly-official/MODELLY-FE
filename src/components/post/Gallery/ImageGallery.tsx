'use client';

import 'swiper/css';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { PostHeader } from '../Header';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 빈 배열 처리
  if (images.length === 0) {
    return null;
  }

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentIndex(swiper.activeIndex);
  };

  return (
    <div className="relative h-[375px] w-full select-none">
      {/* 헤더 */}
      <PostHeader />

      {/* 이미지 캐러셀 */}
      <Swiper
        onSlideChange={handleSlideChange}
        className="size-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative size-full">
              <Image
                src={image}
                alt={`공고 이미지 ${index + 1}`}
                fill
                className="pointer-events-none select-none object-cover"
                draggable={false}
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 이미지 카운터 */}
      {images.length > 1 && (
        <div className="absolute right-4 bottom-4 z-10 rounded-full bg-black/60 px-3 py-1">
          <span className="text-body-2-medium text-white">
            {currentIndex + 1}/{images.length}
          </span>
        </div>
      )}
    </div>
  );
}
