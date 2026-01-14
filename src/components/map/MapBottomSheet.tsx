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

  // 상태에 따른 높이 계산
  const getHeightForState = (state: BottomSheetState): number => {
    return SHEET_HEIGHTS[state];
  };

  // 드래그 시작
  const handleDragStart = useCallback(
    (clientY: number) => {
      setIsDragging(true);
      setDragStartY(clientY);
    },
    []
  );

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

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
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
        root: scrollContainer, // 내부 스크롤 컨테이너 지정
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <div
      ref={sheetRef}
      className="absolute right-0 left-0 z-20 rounded-t-[20px] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
      style={{
        height: `${displayHeight}vh`,
        bottom: `${LAYOUT.BOTTOM_NAV_HEIGHT}px`,
        transition: isDragging ? 'none' : 'height 0.3s ease-out',
      }}
    >
      {/* 드래그 핸들 */}
      <div
        className="flex cursor-grab justify-center pt-3 pb-2 active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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

      {/* 리스트 영역 */}
      <div
        ref={scrollRef}
        className="scrollbar-hide overflow-y-auto px-4"
        style={{
          height: `calc(${displayHeight}vh - 200px)`,
        }}
      >
        {children}
        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-4" />
      </div>
    </div>
  );
}
