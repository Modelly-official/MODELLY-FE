'use client';

import { useState } from 'react';
import Image from 'next/image';
import DotIcon from '@/public/icons/myRecruitment/dot.svg';
import type { WrittenReviewItem } from '@/src/types';
import { subCategoryCodeToName } from '@/src/utils/myRecruitment';

interface WrittenReviewCardProps {
  review: WrittenReviewItem;
  onEdit?: (reviewId: number) => void;
  onDelete?: (reviewId: number) => void;
}

export default function WrittenReviewCard({
  review,
  onEdit,
  onDelete,
}: WrittenReviewCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 날짜 파싱
  const date = new Date(review.createdAt);
  const day = date.getDate();
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

  // 서브카테고리 한글 변환
  const subCategoryLabels = review.subCategories?.map((code) =>
    subCategoryCodeToName(review.category, code)
  ) ?? [];

  // 이미지 개수 (썸네일 제외)
  const imageCount = review.imageUrls?.length ?? 0;
  const additionalImageCount = imageCount > 1 ? imageCount - 1 : 0;

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onEdit?.(review.reviewId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete?.(review.reviewId);
  };

  return (
    <div className="flex gap-3">
      {/* 날짜 영역 (왼쪽) */}
      <div className="flex w-6 shrink-0 flex-col items-center">
        <span className="text-body-1-semibold text-gray-900">{day}</span>
        <span className="text-caption-2-regular text-gray-600">{weekday}</span>
      </div>

      {/* 카드 영역 (오른쪽) */}
      <div className="flex flex-1 gap-3 rounded-[20px] bg-white p-4">
        {/* 썸네일 이미지 */}
        {review.thumbnail && (
          <div className="relative size-[72px] shrink-0 overflow-hidden rounded-lg">
            <Image
              src={review.thumbnail}
              alt="리뷰 이미지"
              fill
              className="object-cover"
            />
            {/* 추가 이미지 개수 표시 */}
            {additionalImageCount > 0 && (
              <div className="absolute bottom-1 left-1 flex items-center justify-center rounded-full bg-black/60 px-1.5 py-0.5">
                <span className="text-caption-2-regular text-white">+{additionalImageCount}</span>
              </div>
            )}
          </div>
        )}

        {/* 리뷰 내용 */}
        <div className="flex flex-1 flex-col gap-2">
          {/* 상단: 카테고리 + 더보기 버튼 */}
          <div className="flex items-start justify-between">
            {/* 서브카테고리 뱃지 */}
            <div className="flex flex-wrap gap-1">
              {subCategoryLabels.map((label) => (
                <span
                  key={label}
                  className="text-caption-1-medium rounded-lg bg-purple-200 px-2 py-0.5 text-purple-700"
                >
                  {label}
                </span>
              ))}
            </div>

            {/* 더보기 버튼 */}
            <div className="relative">
              <button
                type="button"
                onClick={handleMenuClick}
                className="flex size-5 cursor-pointer items-center justify-center"
                aria-label="더보기"
              >
                <DotIcon className="size-5 text-gray-600" />
              </button>

              {/* 드롭다운 메뉴 */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                    }}
                  />
                  <div className="absolute top-6 right-0 z-20 overflow-hidden rounded-[10px] border border-gray-400 bg-white">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-caption-1-medium block w-full cursor-pointer whitespace-nowrap border-b border-gray-400 px-[13px] py-[6px] text-gray-900 hover:bg-gray-100"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="text-caption-1-medium block w-full cursor-pointer whitespace-nowrap px-[13px] py-[6px] text-gray-900 hover:bg-gray-100"
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 디자이너 정보 */}
          <div className="flex flex-col">
            <span className="text-body-2-semibold text-gray-900">{review.designerName}</span>
            {review.shopName && (
              <span className="text-caption-1-medium text-gray-600">{review.shopName}</span>
            )}
          </div>

          {/* 별점 */}
          <div className="flex items-center gap-1">
            <span className="text-body-2-semibold text-gray-900">{review.rating.toFixed(1)}</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  key={star}
                  src={star <= review.rating ? '/icons/common/star.svg' : '/icons/common/star-empty.svg'}
                  alt=""
                  width={14}
                  height={14}
                />
              ))}
            </div>
          </div>

          {/* 리뷰 내용 */}
          <p className="text-body-2-regular line-clamp-2 text-gray-800">{review.content}</p>

          {/* 디자이너 답글 */}
          {review.reply && (
            <div className="mt-1 rounded-lg bg-gray-200 p-3">
              <p className="text-caption-1-medium text-gray-700">{review.reply.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
