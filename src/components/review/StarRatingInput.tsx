'use client';

import Image from 'next/image';
import { useCallback } from 'react';
import { getStarState, getStarIcon } from '@/src/utils/mypage/star';

interface StarRatingInputProps {
  rating: number;
  onChange: (rating: number) => void;
  size?: number;
  className?: string;
}

/**
 * 별점 입력 컴포넌트
 * 0.5~5점 선택 가능 (클릭 위치에 따라 반별/풀별 선택)
 * - 별의 왼쪽 클릭: 반별 (0.5, 1.5, 2.5, 3.5, 4.5)
 * - 별의 오른쪽 클릭: 풀별 (1, 2, 3, 4, 5)
 */
export default function StarRatingInput({
  rating,
  onChange,
  size = 40,
  className = '',
}: StarRatingInputProps) {
  const stars = [1, 2, 3, 4, 5];

  // 클릭 위치에 따라 반별/풀별 결정
  const handleClick = useCallback(
    (star: number, event: React.MouseEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const isLeftHalf = clickX < rect.width / 2;

      // 왼쪽 클릭: 반별 (star - 0.5), 오른쪽 클릭: 풀별 (star)
      const newRating = isLeftHalf ? star - 0.5 : star;
      onChange(newRating);
    },
    [onChange]
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {stars.map((star) => {
        const state = getStarState(rating, star);
        return (
          <button
            key={star}
            type="button"
            onClick={(e) => handleClick(star, e)}
            className="relative cursor-pointer transition-transform active:scale-95"
            aria-label={`${star}점`}
            style={{ width: size, height: size }}
          >
            {/* 빈 별 (배경) */}
            <Image
              src="/icons/common/star-empty.svg"
              alt=""
              width={size}
              height={size}
              className="absolute left-0 top-0"
            />
            {/* 채워진 별 또는 반별 */}
            {state !== 'empty' && (
              <Image
                src={getStarIcon(state)}
                alt={state === 'full' ? '채워진 별' : '반 채워진 별'}
                width={size}
                height={size}
                className="absolute left-0 top-0"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
