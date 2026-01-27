'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import StarDisplay from '@/src/components/common/StarDisplay';
import KebabMenu from '@/src/components/common/KebabMenu/KebabMenu';
import type { WrittenReviewItem } from '@/src/types';

interface WrittenReviewCardProps {
  review: WrittenReviewItem;
  onEdit?: (reviewId: number) => void;
  onDelete?: (reviewId: number) => void;
  showDate?: boolean;
  isLastInDateGroup?: boolean;
  isLastInMonth?: boolean;
  isFirstItem?: boolean;
}

export default function WrittenReviewCard({
  review,
  onEdit,
  onDelete,
  showDate = true,
  isLastInDateGroup = true,
  isLastInMonth = false,
  isFirstItem = false,
}: WrittenReviewCardProps) {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 날짜 파싱
  const date = new Date(review.createdAt);
  const day = date.getDate();

  // 이미지 배열
  const images = review.imageList ?? [];

  // 날짜가 바뀔 때 gap 적용 (첫 번째 아이템 제외)
  const needsTopGap = showDate && !isFirstItem;

  // 이미지 드래그 스크롤 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - imageContainerRef.current.offsetLeft);
    setScrollLeft(imageContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - imageContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    imageContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={`flex ${needsTopGap ? 'mt-4' : ''}`}>
      {/* 날짜 + 세로선 영역 (왼쪽) */}
      <div className="flex w-8 shrink-0 flex-col items-center">
        {/* 날짜 표시 (showDate가 true일 때만) */}
        {showDate ? (
          <div className="flex flex-col items-center">
            <span className="text-body-2-medium text-gray-900">{day}</span>
            <span className="text-caption-1-medium text-gray-700">일</span>
          </div>
        ) : (
          <div className="h-0" />
        )}
        {/* 세로 타임라인 선 */}
        <div
          className={`mt-2 w-px flex-1 bg-gray-400 ${isLastInMonth ? 'mb-0' : ''}`}
          style={{ minHeight: isLastInDateGroup && !isLastInMonth ? '16px' : undefined }}
        />
      </div>

      {/* 카드 영역 */}
      <div className={`ml-[6px] flex min-w-0 flex-1 flex-col gap-3 rounded-[16px] bg-white px-5 py-4 ${!showDate ? 'mt-4' : ''}`}>
        {/* 상단: 디자이너 정보 + 별점 */}
        <div className="flex flex-col gap-2">
          {/* 디자이너명 + 매장 + 더보기 버튼 */}
          <div className="flex items-start justify-between">
            <div className="flex items-end gap-2">
              {/* 디자이너명 */}
              <span className="text-head-4-medium text-black">{review.designerName} 디자이너</span>
              {/* 매장명 */}
              {review.shop && (
                <span className="text-caption-1-medium text-gray-700">{review.shop}</span>
              )}
            </div>

            {/* 더보기 버튼 */}
            <KebabMenu
              items={[
                { label: '수정', onClick: () => onEdit?.(review.reviewId) },
                { label: '삭제', onClick: () => onDelete?.(review.reviewId) },
              ]}
            />
          </div>

          {/* 별점 */}
          <div className="flex items-center gap-1">
            <span className="text-body-2-medium text-gray-900">{review.rating.toFixed(1)}</span>
            <StarDisplay rating={review.rating} size={20} />
          </div>
        </div>

        {/* 리뷰 내용 */}
        <p className="text-body-2-regular text-gray-900">{review.content}</p>

        {/* 이미지 목록 */}
        {images.length > 0 && (
          <div
            ref={imageContainerRef}
            className={`-mx-5 flex gap-2 overflow-x-auto px-5 scrollbar-hide ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {images.map((url, index) => (
              <div
                key={index}
                className="relative size-[132px] shrink-0 overflow-hidden rounded-lg"
              >
                <Image
                  src={url}
                  alt={`리뷰 이미지 ${index + 1}`}
                  fill
                  className="pointer-events-none select-none object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        )}

        {/* 카테고리 배지 */}
        {review.summary && (
          <div className="flex gap-2">
            <span className="rounded-lg bg-purple-200 px-2 py-1 text-caption-1-medium text-purple-700">
              {review.summary}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
