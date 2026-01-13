'use client';

import Image from 'next/image';
import RefreshIcon from '@/public/icons/map/refresh.svg';

// BottomNav 높이 (px)
const BOTTOM_NAV_HEIGHT = 76;
// SelectedShopCard 예상 높이 (px)
const SELECTED_CARD_HEIGHT = 340;

interface MapControlsProps {
  onRefreshSearch: () => void;
  onCurrentLocation: () => void;
  showRefreshButton?: boolean;
  bottomSheetHeight: number; // vh 단위
  isSelectedShopCard?: boolean; // SelectedShopCard 표시 여부
  selectedCardDragOffset?: number; // SelectedShopCard 드래그 오프셋 (px)
}

export default function MapControls({
  onRefreshSearch,
  onCurrentLocation,
  showRefreshButton = true,
  bottomSheetHeight,
  isSelectedShopCard = false,
  selectedCardDragOffset = 0,
}: MapControlsProps) {
  // GPS 버튼 bottom 위치 계산 (드래그 오프셋 반영)
  const gpsButtonBottom = isSelectedShopCard
    ? `${BOTTOM_NAV_HEIGHT + SELECTED_CARD_HEIGHT + 18 - selectedCardDragOffset}px`
    : `calc(${bottomSheetHeight}vh + ${BOTTOM_NAV_HEIGHT}px + 18px)`;

  return (
    <>
      {/* 현 지도에서 검색 버튼 - 상단 중앙 */}
      {showRefreshButton && (
        <button
          type="button"
          onClick={onRefreshSearch}
          className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer items-center gap-1 rounded-[34px] border border-gray-400 bg-white px-3 py-2 shadow-sm"
        >
          <RefreshIcon className="size-6 text-gray-800" />
          <span className="text-body-2-medium text-gray-900">현 지도에서 검색</span>
        </button>
      )}

      {/* 현재 위치 버튼 - BottomSheet/SelectedCard 상단에서 18px 위 */}
      <button
        type="button"
        onClick={onCurrentLocation}
        className="absolute right-4 z-30 cursor-pointer"
        style={{
          bottom: gpsButtonBottom,
          transition: 'bottom 0.1s ease-out',
        }}
      >
        <Image
          src="/icons/map/gps.svg"
          alt="현재 위치"
          width={38}
          height={38}
        />
      </button>
    </>
  );
}
