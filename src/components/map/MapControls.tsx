'use client';

import RefreshIcon from '@/public/icons/map/refresh.svg';

interface MapControlsProps {
  onRefreshSearch: () => void;
  showRefreshButton?: boolean;
}

export default function MapControls({
  onRefreshSearch,
  showRefreshButton = true,
}: MapControlsProps) {
  if (!showRefreshButton) return null;

  return (
    <button
      type="button"
      onClick={onRefreshSearch}
      className="absolute top-[calc(16px+env(safe-area-inset-top))] left-1/2 z-10 flex -translate-x-1/2 cursor-pointer items-center gap-1 rounded-[34px] border border-gray-400 bg-white px-3 py-2 shadow-sm"
    >
      <RefreshIcon className="size-6 text-gray-800" />
      <span className="text-body-2-medium text-gray-900">현 지도에서 검색</span>
    </button>
  );
}
