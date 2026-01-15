'use client';

interface MapLoadingIndicatorProps {
  message: string;
}

/**
 * Map 페이지 상단에 표시되는 로딩 인디케이터
 * - 위치 로딩, 샵 검색, 프로필 로딩 등에 사용
 */
export default function MapLoadingIndicator({ message }: MapLoadingIndicatorProps) {
  return (
    <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-2 shadow-md">
      <span className="text-body-2-medium text-gray-700">{message}</span>
    </div>
  );
}

/**
 * 로딩 상태에 따른 메시지 반환 헬퍼
 */
export function getLoadingMessage({
  isLocationLoading,
  isShopsLoading,
  isRecruitmentsLoading,
}: {
  isLocationLoading: boolean;
  isShopsLoading: boolean;
  isRecruitmentsLoading: boolean;
}): string | null {
  if (isLocationLoading) return '현재 위치를 가져오는 중...';
  if (isShopsLoading) return '샵을 검색하는 중...';
  if (isRecruitmentsLoading) return '공고를 불러오는 중...';
  return null;
}
