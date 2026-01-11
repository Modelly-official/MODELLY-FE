'use client';

import Image from 'next/image';

interface StarRatingInputProps {
  rating: number;
  onChange: (rating: number) => void;
  size?: number;
  className?: string;
}

/**
 * 별점 입력 컴포넌트
 * 1~5점 선택 가능 (클릭으로 선택)
 */
export default function StarRatingInput({
  rating,
  onChange,
  size = 40,
  className = '',
}: StarRatingInputProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform active:scale-95"
          aria-label={`${star}점`}
        >
          <Image
            src={
              star <= rating
                ? '/icons/common/star.svg'
                : '/icons/common/star-empty.svg'
            }
            alt={star <= rating ? '채워진 별' : '빈 별'}
            width={size}
            height={size}
          />
        </button>
      ))}
    </div>
  );
}
