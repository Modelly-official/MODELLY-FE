'use client';

import Image from 'next/image';
import { getStarState, getStarIcon } from '@/src/utils/mypage/star';

interface StarDisplayProps {
  rating: number;
  size?: number;
  className?: string;
}

/**
 * 별점 표시 컴포넌트 (읽기 전용)
 * 0.5 단위 반별 표시 지원
 */
export default function StarDisplay({
  rating,
  size = 14,
  className = '',
}: StarDisplayProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const state = getStarState(rating, star);
        return (
          <div key={star} className="relative" style={{ width: size, height: size }}>
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
                alt=""
                width={size}
                height={size}
                className="absolute left-0 top-0"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
