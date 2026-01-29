'use client';

import Image from 'next/image';
import PinIcon from '@/public/icons/common/check-circle.svg';
import StarDisplay from '@/src/components/common/StarDisplay';
import KebabMenu from '@/src/components/common/KebabMenu/KebabMenu';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import type { DesignerReviewItem } from '@/src/types';

const REPLY_MAX_LENGTH = 200;

interface DesignerReviewCardProps {
  review: DesignerReviewItem;
  onPin?: (reviewId: number, isFixed: boolean) => void;
  onReplyClick?: (reviewId: number) => void;
  onReplyEdit?: (reviewId: number, replyId: number) => void;
  isReplying?: boolean;
  replyContent?: string;
  onReplyContentChange?: (content: string) => void;
  onReplySubmit?: () => void;
  onReplyCancel?: () => void;
  isSubmittingReply?: boolean;
}

export default function DesignerReviewCard({
  review,
  onPin,
  onReplyClick,
  onReplyEdit,
  isReplying = false,
  replyContent = '',
  onReplyContentChange,
  onReplySubmit,
  onReplyCancel,
  isSubmittingReply = false,
}: DesignerReviewCardProps) {
  // 날짜 포맷팅 (YYYY-MM-DD → YYYY.MM.DD)
  const formattedDate = review.createdDate.replace(/-/g, '.');

  // 이미지 배열
  const images = review.reviewImages ?? [];

  // 답글 달기 클릭
  const handleReplyClick = () => {
    onReplyClick?.(review.reviewId);
  };

  // 답글 수정 클릭
  const handleReplyEdit = () => {
    if (review.replyDto) {
      onReplyEdit?.(review.reviewId, review.replyDto.replyId);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 bg-white px-5 pb-5 pt-4">
      {/* 상단: 프로필 + 정보 */}
      <div className="flex w-full items-center gap-3">
        {/* 프로필 이미지 */}
        <div className="relative size-[42px] shrink-0 overflow-hidden rounded-full bg-gray-200">
          {review.modelImage ? (
            <Image
              src={review.modelImage}
              alt={review.modelName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-caption-1-medium text-gray-600">
              {review.modelName.charAt(0)}
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex flex-1 flex-col gap-0.5">
          {/* 이름 + 고정 아이콘 + 더보기 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-body-1-medium text-black">{review.modelName}</span>
              {review.isFixed && (
                <PinIcon className="size-6 text-gray-900" />
              )}
            </div>

            {/* 더보기 버튼 */}
            <KebabMenu
              items={[
                {
                  label: review.isFixed ? '고정 취소' : '리뷰 고정',
                  onClick: () => onPin?.(review.reviewId, !review.isFixed),
                },
              ]}
            />
          </div>

          {/* 별점 + 날짜 */}
          <div className="flex items-center justify-between">
            <StarDisplay rating={review.rating} size={12} />
            <span className="text-caption-1-medium text-gray-700">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* 이미지 */}
      {images.length > 0 && (
        <div className="flex gap-2">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative h-[99px] w-[98px] shrink-0 overflow-hidden rounded-lg"
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

      {/* 리뷰 내용 + 카테고리 */}
      <div className="flex flex-col gap-2">
        <p className="text-body-2-regular text-gray-900">{review.content}</p>

        {/* 카테고리 배지 */}
        {review.summary && (
          <div className="flex flex-wrap gap-1">
            {review.summary.split(', ').map((category) => (
              <CategoryBadge key={category} label={category} />
            ))}
          </div>
        )}
      </div>

      {/* 답글 입력 모드 */}
      {isReplying && (
        <>
          <div className="flex h-[160px] flex-col justify-between rounded-xl border border-gray-400 p-4">
            <textarea
              value={replyContent}
              onChange={(e) => {
                if (e.target.value.length <= REPLY_MAX_LENGTH) {
                  onReplyContentChange?.(e.target.value);
                }
              }}
              placeholder="내용을 입력하세요"
              className="h-full w-full resize-none text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none"
            />
            <div className="text-right">
              <span className="text-body-2-regular text-gray-600">
                {replyContent.length}/{REPLY_MAX_LENGTH}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReplyCancel}
              className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white text-body-2-medium text-gray-900"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onReplySubmit}
              disabled={isSubmittingReply || !replyContent.trim()}
              className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-body-2-medium text-white disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmittingReply ? (
                <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                '완료'
              )}
            </button>
          </div>
        </>
      )}

      {/* 답글이 있는 경우 */}
      {!isReplying && review.replyDto && (
        <>
          <div className="flex flex-col gap-3 rounded-xl bg-gray-100 p-4">
            <span className="text-caption-1-medium text-gray-600">내가 남긴 답글</span>
            <p className="text-body-2-regular text-gray-900">{review.replyDto.content}</p>
          </div>
          <button
            type="button"
            onClick={handleReplyEdit}
            className="flex h-12 w-full cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white text-body-2-medium text-gray-900"
          >
            답글 수정하기
          </button>
        </>
      )}

      {/* 답글이 없고 입력 모드가 아닌 경우 - 답글 달기 버튼만 */}
      {!isReplying && !review.replyDto && (
        <button
          type="button"
          onClick={handleReplyClick}
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-gray-900 text-body-2-medium text-white"
        >
          답글 달기
        </button>
      )}
    </div>
  );
}
