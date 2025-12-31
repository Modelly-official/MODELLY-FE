import { formatDistance } from '@/src/utils/common';

interface DistanceDisplayProps {
  distance: number | null | undefined;
  className?: string;
}

/**
 * 거리 정보를 표시하는 공통 컴포넌트
 */
export default function DistanceDisplay({ distance, className = '' }: DistanceDisplayProps) {
  return (
    <span className={`text-caption-1-medium text-gray-800 ${className}`}>{formatDistance(distance ?? 0)}</span>
  );
}
