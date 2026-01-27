'use client';

interface PaginationDotsProps {
  totalCount: number;
  activeIndex: number;
  onSelect?: (index: number) => void;
  maxVisible?: number;
  className?: string;
  dotClassName?: string;
  activeDotClassName?: string;
  ariaLabelPrefix?: string;
}

/**
 * 최대 노출 개수를 제한한 점 페이지네이션
 */
export default function PaginationDots({
  totalCount,
  activeIndex,
  onSelect,
  maxVisible = 3,
  className = 'flex items-center justify-center gap-2',
  dotClassName = 'h-1.5 w-1.5 rounded-full bg-gray-300 transition-colors',
  activeDotClassName = 'bg-gray-900',
  ariaLabelPrefix = '페이지',
}: PaginationDotsProps) {
  if (totalCount <= 0) return null;

  const visibleCount = Math.min(totalCount, Math.max(1, maxVisible));
  const half = Math.floor(visibleCount / 2);
  const maxStartIndex = Math.max(0, totalCount - visibleCount);
  const startIndex = Math.min(Math.max(activeIndex - half, 0), maxStartIndex);

  return (
    <div className={className}>
      {Array.from({ length: visibleCount }).map((_, position) => {
        const slideIndex = startIndex + position;
        const isActive = slideIndex === activeIndex;
        return (
          <button
            key={`pagination-dot-${position}`}
            type="button"
            onClick={() => onSelect?.(slideIndex)}
            className={`${dotClassName} ${isActive ? activeDotClassName : ''}`}
            aria-label={`${ariaLabelPrefix} ${slideIndex + 1}`}
            disabled={!onSelect}
          />
        );
      })}
    </div>
  );
}
