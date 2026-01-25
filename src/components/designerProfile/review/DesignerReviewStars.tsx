import StarDisplay from '@/src/components/common/StarDisplay';

interface DesignerReviewStarsProps {
  rating: number;
  size?: number;
  className?: string;
}

/**
 * 별점 표시 컴포넌트 (읽기 전용)
 * StarDisplay 컴포넌트를 래핑하여 기존 인터페이스 유지
 */
export default function DesignerReviewStars({
  rating,
  size = 14,
  className = '',
}: DesignerReviewStarsProps) {
  return <StarDisplay rating={rating} size={size} className={className} />;
}
