import Image from 'next/image';

interface RatingDisplayProps {
  rating: number | null | undefined;
  reviewCount: number | null | undefined;
  className?: string;
}

/**
 * 별점과 리뷰 개수를 표시하는 공통 컴포넌트
 */
export default function RatingDisplay({ rating, reviewCount, className = '' }: RatingDisplayProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Image src="/icons/common/star.svg" alt="별점" width={14} height={14} />
      <span className="text-caption-1-medium text-gray-800">
        {rating?.toFixed(1) ?? '0.0'} ({(reviewCount ?? 0).toLocaleString()})
      </span>
    </div>
  );
}
