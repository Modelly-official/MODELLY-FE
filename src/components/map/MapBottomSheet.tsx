'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { Category, SubCategory, SortOption } from '@/src/types/recruitment';
import type { BottomSheetState } from '@/src/types/map';
import { CATEGORIES, SUB_CATEGORIES_BY_CATEGORY, SORT_OPTIONS } from '@/src/constants/explore';
import { LAYOUT, SHEET_HEIGHTS, DRAG } from '@/src/constants/map';
import { CategoryTabs, SubCategoryChips, SortDropdown } from '@/src/components/explore';

// re-export for backward compatibility
export { SHEET_HEIGHTS } from '@/src/constants/map';

interface MapBottomSheetProps {
  category: Category;
  subCategory: SubCategory | 'ALL';
  sortOption: SortOption;
  totalCount: number;
  onCategoryChange: (category: Category) => void;
  onSubCategoryChange: (subCategory: SubCategory | 'ALL') => void;
  onSortChange: (sortOption: SortOption) => void;
  onHeightChange?: (height: number) => void;
  // 무한 스크롤 props
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  children: React.ReactNode;
}

export default function MapBottomSheet({
  category,
  subCategory,
  sortOption,
  totalCount,
  onCategoryChange,
  onSubCategoryChange,
  onSortChange,
  onHeightChange,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  children,
}: MapBottomSheetProps) {
  const [sheetState, setSheetState] = useState<BottomSheetState>('min');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentHeight, setCurrentHeight] = useState<number>(SHEET_HEIGHTS.min);
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // max 상태에서 스크롤이 맨 위인지 확인
  const isScrollAtTop = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return true;
    return scrollEl.scrollTop <= 0;
  }, []);

  // 상태에 따른 높이 계산
  const getHeightForState = (state: BottomSheetState): number => {
    return SHEET_HEIGHTS[state];
  };

  // 드래그 시작
  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    setDragStartY(clientY);
  }, []);

  // 드래그 중
  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDragging) return;

      const deltaY = dragStartY - clientY;
      const deltaVh = (deltaY / window.innerHeight) * 100;
      const newHeight = Math.max(
        SHEET_HEIGHTS.min,
        Math.min(SHEET_HEIGHTS.max, getHeightForState(sheetState) + deltaVh)
      );
      setCurrentHeight(newHeight);
    },
    [isDragging, dragStartY, sheetState]
  );

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    const deltaVh = currentHeight - getHeightForState(sheetState);

    // 드래그 임계값에 따라 상태 변경
    if (deltaVh > (DRAG.THRESHOLD / window.innerHeight) * 100) {
      // 위로 드래그
      if (sheetState === 'min') {
        setSheetState('mid');
        setCurrentHeight(SHEET_HEIGHTS.mid);
      } else if (sheetState === 'mid') {
        setSheetState('max');
        setCurrentHeight(SHEET_HEIGHTS.max);
      }
    } else if (deltaVh < -(DRAG.THRESHOLD / window.innerHeight) * 100) {
      // 아래로 드래그
      if (sheetState === 'max') {
        setSheetState('mid');
        setCurrentHeight(SHEET_HEIGHTS.mid);
      } else if (sheetState === 'mid') {
        setSheetState('min');
        setCurrentHeight(SHEET_HEIGHTS.min);
      }
    } else {
      // 원래 상태로 복귀
      setCurrentHeight(getHeightForState(sheetState));
    }
  }, [isDragging, currentHeight, sheetState]);

  // 핸들 터치 이벤트 (항상 드래그)
  const handleHandleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDragStart(e.touches[0].clientY);
  };

  const handleHandleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientY);
  };

  const handleHandleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDragEnd();
  };

  // 스크롤 영역 터치 이벤트 (max 상태에서만 스크롤, 아니면 드래그)
  const scrollTouchStartY = useRef(0);
  const isScrollDragging = useRef(false);

  const handleScrollTouchStart = (e: React.TouchEvent) => {
    scrollTouchStartY.current = e.touches[0].clientY;
    isScrollDragging.current = false;

    // max 상태가 아니면 드래그 모드
    if (sheetState !== 'max') {
      handleDragStart(e.touches[0].clientY);
      isScrollDragging.current = true;
    }
  };

  const handleScrollTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const deltaY = scrollTouchStartY.current - currentY;

    // max 상태가 아니면 드래그
    if (sheetState !== 'max') {
      if (isScrollDragging.current) {
        e.preventDefault();
        handleDragMove(currentY);
      }
      return;
    }

    // max 상태에서 스크롤이 맨 위이고 아래로 드래그하면 시트 높이 줄이기
    if (isScrollAtTop() && deltaY < -10) {
      if (!isScrollDragging.current) {
        handleDragStart(currentY);
        isScrollDragging.current = true;
      }
      e.preventDefault();
      handleDragMove(currentY);
    } else if (isScrollDragging.current) {
      e.preventDefault();
      handleDragMove(currentY);
    }
    // 그 외에는 기본 스크롤 동작
  };

  const handleScrollTouchEnd = () => {
    if (isScrollDragging.current) {
      handleDragEnd();
      isScrollDragging.current = false;
    }
  };

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientY);
  };

  // 글로벌 마우스 이벤트
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientY);
    };

    const handleMouseUp = () => {
      handleDragEnd();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // 현재 높이 (드래그 중이면 currentHeight, 아니면 상태에 따른 높이)
  const displayHeight = isDragging ? currentHeight : getHeightForState(sheetState);

  // 높이 변경 시 부모에게 알림
  useEffect(() => {
    onHeightChange?.(displayHeight);
  }, [displayHeight, onHeightChange]);

  // IntersectionObserver로 무한 스크롤 감지
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const loadMoreElement = loadMoreRef.current;
    if (!scrollContainer || !loadMoreElement || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      {
        root: scrollContainer,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  // max 상태가 아니면 스크롤 비활성화
  const scrollStyle = sheetState === 'max'
    ? { height: `calc(${displayHeight}dvh - 200px)` }
    : { height: `calc(${displayHeight}dvh - 200px)`, overflow: 'hidden' as const };

  return (
    <div
      ref={sheetRef}
      className="fixed right-0 left-0 z-20 rounded-t-[20px] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] sm:left-1/2 sm:w-[375px] sm:-translate-x-1/2"
      style={{
        height: `${displayHeight}dvh`,
        bottom: `${LAYOUT.BOTTOM_NAV_HEIGHT}px`,
        transition: isDragging ? 'none' : 'height 0.3s ease-out',
      }}
    >
      {/* 드래그 핸들 - 항상 드래그 가능 */}
      <div
        className="flex cursor-grab justify-center pt-3 pb-2 active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        onTouchStart={handleHandleTouchStart}
        onTouchMove={handleHandleTouchMove}
        onTouchEnd={handleHandleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="h-1.5 w-14 rounded-[9px] bg-gray-400" />
      </div>

      {/* 타이틀 */}
      <div className="px-4 py-1">
        <h2 className="text-head-4-semibold text-gray-900">공고 리스트</h2>
      </div>

      {/* 카테고리 탭 */}
      <CategoryTabs
        categories={CATEGORIES}
        selectedCategory={category}
        onCategoryChange={(cat) => onCategoryChange(cat as Category)}
      />

      {/* 필터 영역 */}
      <div className="flex flex-col gap-3 px-4 py-3">
        {/* 서브 카테고리 칩 */}
        <SubCategoryChips
          subCategories={SUB_CATEGORIES_BY_CATEGORY[category]}
          selectedSubCategory={subCategory}
          onSubCategoryChange={(sub) => onSubCategoryChange(sub as SubCategory | 'ALL')}
        />

        {/* 총 개수 및 정렬 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-body-2-medium text-black">전체</span>
            <span className="text-body-2-semibold text-gray-600">{totalCount}</span>
          </div>
          <SortDropdown
            sortOptions={SORT_OPTIONS}
            selectedSort={sortOption}
            onSortChange={(s) => onSortChange(s as SortOption)}
          />
        </div>
      </div>

      {/* 리스트 영역 - max 상태에서만 스크롤 가능 */}
      <div
        ref={scrollRef}
        className="scrollbar-hide px-4"
        style={{
          ...scrollStyle,
          overflowY: sheetState === 'max' ? 'auto' : 'hidden',
          touchAction: sheetState === 'max' ? 'pan-y' : 'none',
        }}
        onTouchStart={handleScrollTouchStart}
        onTouchMove={handleScrollTouchMove}
        onTouchEnd={handleScrollTouchEnd}
      >
        {children}
        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-4" />
      </div>
    </div>
  );
}
