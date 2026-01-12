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
  const [isImagesExpanded, setIsImagesExpanded] = useState(false);

  // 날짜 파싱
  const date = new Date(review.createdAt);
  const day = date.getDate();
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

  // 서브카테고리 한글 변환 (category가 있을 때만)
  const subCategoryLabels = review.category && review.subCategories
    ? review.subCategories.map((code) => subCategoryCodeToName(review.category!, code))
    : [];

  // 이미지 배열
  const images = review.imageUrls ?? [];
  const hasMultipleImages = images.length > 1;
  const additionalImageCount = images.length > 1 ? images.length - 1 : 0;

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

  const handleImageClick = () => {
    if (hasMultipleImages) {
      setIsImagesExpanded(!isImagesExpanded);
    }
  };

  return (
    <div className="flex">
      {/* 날짜 + 세로선 영역 (왼쪽) */}
      <div className="flex w-8 shrink-0 flex-col items-center">
        {/* 날짜 */}
        <span className="text-body-2-regular text-gray-900">{day}</span>
        <span className="text-body-2-regular text-gray-800">{weekday}</span>
        {/* 세로 구분선 */}
        <div className="mt-2 h-full w-px bg-gray-400" />
      </div>

      {/* 카드 영역 (오른쪽) - Figma: rounded-16, p-16, gap-12 */}
      <div className="ml-3 flex flex-1 flex-col gap-3 rounded-[16px] bg-white p-4">
        {/* 이미지 영역 - 확장 시 전체 이미지 표시 */}
        {isImagesExpanded && images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((url, index) => (
              <div
                key={index}
                className="relative size-[100px] shrink-0 overflow-hidden rounded-lg"
              >
                <Image
                  src={url}
                  alt={`리뷰 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* 상단 영역: 이미지 + 정보 - Figma: gap-16 */}
        <div className="flex gap-4">
          {/* 썸네일 이미지 - Figma: 100x100, rounded-8 */}
          {!isImagesExpanded && review.thumbnail && (
            <button
              type="button"
              onClick={handleImageClick}
              className={`relative size-[100px] shrink-0 overflow-hidden rounded-lg ${hasMultipleImages ? 'cursor-pointer' : ''}`}
            >
              <Image
                src={review.thumbnail}
                alt="리뷰 이미지"
                fill
                className="object-cover"
              />
              {/* 추가 이미지 개수 표시 - Figma: bottom-right, rounded-14, bg-rgba(47,46,50,0.6) */}
              {additionalImageCount > 0 && (
                <div className="absolute right-2 bottom-2 flex items-center justify-center rounded-[14px] bg-[rgba(47,46,50,0.6)] px-2 py-0.5">
                  <span className="text-caption-1-medium text-white">+{additionalImageCount}</span>
                </div>
              )}
            </button>
          )}

          {/* 리뷰 정보 */}
          <div className="flex flex-1 flex-col gap-1">
            {/* 상단: 카테고리 + 더보기 버튼 */}
            <div className="flex items-center justify-between">
              {/* 서브카테고리 뱃지 - Figma: bg-#ebeeff, text-#5559ff, rounded-8, px-8, py-4 */}
              <div className="flex flex-wrap gap-1">
                {subCategoryLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-lg bg-purple-200 px-2 py-1 text-caption-1-medium text-purple-700"
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
                  <DotIcon className="size-5 text-gray-900" />
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
                        className="block w-full cursor-pointer whitespace-nowrap border-b border-gray-400 px-[13px] py-[6px] text-caption-1-medium text-gray-900 hover:bg-gray-100"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="block w-full cursor-pointer whitespace-nowrap px-[13px] py-[6px] text-caption-1-medium text-gray-900 hover:bg-gray-100"
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 디자이너 정보 - Figma: gap-2 */}
            <div className="flex flex-col gap-0.5">
              {/* 디자이너명 - Figma: Body 1 Medium 16px, #222 */}
              <span className="text-body-1-medium text-black">{review.designerName}</span>
              {/* 매장명 - Figma: Body 2 Medium 14px, #54555e */}
              {review.shop && (
                <span className="text-body-2-medium text-gray-800">{review.shop}</span>
              )}
            </div>

            {/* 별점 - Figma: gap-8, 숫자 14px #54555e, 별 16px */}
            <div className="flex items-center gap-2">
              <span className="text-body-2-medium text-gray-800">{review.rating.toFixed(1)}</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Image
                    key={star}
                    src={star <= review.rating ? '/icons/common/star.svg' : '/icons/common/star-empty.svg'}
                    alt=""
                    width={16}
                    height={16}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 내용 - Figma: Body 2 Regular 14px, #2f2e32, px-4 */}
        <div className="px-1">
          <p className="text-body-2-regular text-gray-900">{review.content}</p>
        </div>

        {/* 디자이너 답글 */}
        {review.reply && (
          <div className="rounded-lg bg-gray-200 p-3">
            <p className="text-caption-1-medium text-gray-700">{review.reply.content}</p>
          </div>
        )}

        {/* 접기 버튼 (이미지 확장 시) */}
        {isImagesExpanded && (
          <button
            type="button"
            onClick={() => setIsImagesExpanded(false)}
            className="text-caption-1-medium cursor-pointer text-center text-gray-600"
          >
            접기
          </button>
        )}
      </div>
    </div>
  );
}
