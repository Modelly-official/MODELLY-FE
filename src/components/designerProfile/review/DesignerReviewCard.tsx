'use client';

import Image from 'next/image';
import ProfileIcon from '@/public/icons/chat/profile.svg';
import PinIcon from '@/public/icons/common/pin.svg';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import DesignerReviewStars from '@/src/components/designerProfile/review/DesignerReviewStars';

export interface DesignerReviewItem {
  id: number;
  name: string;
  rating: number;
  date: string;
  content: string;
  images: string[];
  summary?: string;
  isFixed?: boolean;
  replyDto?: {
    replyId: number;
    designerName?: string;
    content: string;
    createdAt?: string;
  } | null;
}

interface DesignerReviewCardProps {
  review: DesignerReviewItem;
  onImageClick?: (reviewId: number, imageUrl: string) => void;
}

export default function DesignerReviewCard({ review, onImageClick }: DesignerReviewCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white px-4 pt-4 pb-5 shadow-[0_0_4px_rgba(34,34,34,0.06)]">
      <div className="grid grid-cols-[44px_1fr_auto] grid-rows-[auto_auto] items-center gap-x-3 gap-y-1">
        <div className="row-span-2 flex h-11 w-11 items-center justify-center rounded-full bg-gray-300">
          <ProfileIcon className="h-7 w-7 text-gray-500" />
        </div>
        <span className="text-body-1-medium text-gray-900">{review.name}</span>
        <DesignerReviewStars rating={review.rating} className="col-start-2 row-start-2" />
        {review.isFixed && (
          <div className="col-start-3 row-start-1 flex justify-end justify-self-end">
            <PinIcon className="h-5 w-5 text-gray-700" />
          </div>
        )}
        <span className="text-caption-1-medium col-start-3 row-start-2 justify-self-end text-gray-700">
          {review.date}
        </span>
      </div>

      {review.images.length > 0 && (
        <div className="flex gap-2">
          {review.images.map((imageUrl, index) =>
            onImageClick ? (
              <button
                key={`${imageUrl}-${index}`}
                type="button"
                onClick={() => onImageClick(review.id, imageUrl)}
                className="relative h-[99px] w-[98px] cursor-pointer overflow-hidden rounded-lg"
                aria-label={`리뷰 사진 ${index + 1} 보기`}
              >
                <Image src={imageUrl} alt="" fill sizes="92px" className="object-cover" />
              </button>
            ) : (
              <div key={`${imageUrl}-${index}`} className="relative h-[99px] w-[98px] overflow-hidden rounded-lg">
                <Image src={imageUrl} alt="" fill sizes="92px" className="object-cover" />
              </div>
            ),
          )}
        </div>
      )}

      <p className="text-body-2-regular whitespace-pre-line text-gray-900">{review.content}</p>
      {review.summary && (
        <div className="flex flex-wrap gap-1">
          {review.summary
            .split(', ')
            .filter((category) => category.trim())
            .map((category, index) => (
              <CategoryBadge key={`${category}-${index}`} label={category} />
            ))}
        </div>
      )}

      {review.replyDto?.content && (
        <div className="flex flex-col gap-3 rounded-xl bg-gray-100 px-4 py-4">
          <span className="text-caption-1-medium text-gray-500">디자이너가 남긴 답글</span>
          <p className="text-body-2-regular whitespace-pre-line text-gray-900">{review.replyDto.content}</p>
        </div>
      )}
    </div>
  );
}
