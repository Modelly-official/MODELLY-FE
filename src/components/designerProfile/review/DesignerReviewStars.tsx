'use client';

import Image from 'next/image';

interface DesignerReviewStarsProps {
  rating: number;
  size?: number;
  className?: string;
}

export default function DesignerReviewStars({
  rating,
  size = 14,
  className = '',
}: DesignerReviewStarsProps) {
  const filledCount = Math.round(rating);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Image
          key={`star-${index}`}
          src={index < filledCount ? '/icons/common/star.svg' : '/icons/common/star-empty.svg'}
          alt=""
          width={size}
          height={size}
        />
      ))}
    </div>
  );
}
