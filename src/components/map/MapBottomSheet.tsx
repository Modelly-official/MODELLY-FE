'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { Category, SubCategory, SortOption } from '@/src/types/recruitment';
import type { BottomSheetState } from '@/src/types/map';
import { CATEGORIES, SUB_CATEGORIES_BY_CATEGORY, SORT_OPTIONS } from '@/src/constants/explore';
import { LAYOUT, SHEET_HEIGHTS, DRAG } from '@/src/constants/map';
import { CategoryTabs, SubCategoryChips, SortDropdown } from '@/src/components/explore';

// re-export for backward compatibility
export { SHEET_HEIGHTS } from '@/src/constants/map';

// 드래그 시작 임계값 (px) - 이 거리 이상 이동해야 드래그로 인식
const DRAG_START_THRESHOLD = 10;

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

// 상태별 translateY 계산 (max 높이 기준으로 얼마나 아래로 내릴지)
const getTranslateY = (state: BottomSheetState): number => {
  return SHEET_HEIGHTS.max - SHEET_HEIGHTS[state];
};

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
  // DOM 참조
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 드래그 상태 (ref로 관리 - 리렌더링 방지)
  const isDraggingRef = useRef(false);
  const isDragStartedRef = useRef(false); // 임계값 넘어서 실제 드래그 시작됨
  const dragStartYRef = useRef(0);
  const baseTranslateYRef = useRef(getTranslateY('min'));
  const currentTranslateYRef = useRef(getTranslateY('min'));

  // 글로벌 마우스 리스너 cleanup용 ref
  const mouseListenersRef = useRef<{
    mousemove: (e: MouseEvent) => void;
    mouseup: () => void;
  } | null>(null);

  // 스냅 상태 (state로 관리 - 드래그 종료 시에만 업데이트)
  const [sheetState, setSheetState] = useState<BottomSheetState>('min');

  // max 상태에서 스크롤이 맨 위인지 확인
  const isScrollAtTop = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return true;
    return scrollEl.scrollTop <= 0;
  }, []);

  // DOM 직접 업데이트 (리렌더링 없음)
  const updateTransform = useCallback((translateY: number, animate: boolean = false) => {
    if (!sheetRef.current) return;
    sheetRef.current.style.transition = animate ? 'transform 0.3s ease-out' : 'none';
    sheetRef.current.style.transform = `translateY(${translateY}dvh)`;
  }, []);

  // 높이 변경 시 부모에게 알림
  useEffect(() => {
    onHeightChange?.(SHEET_HEIGHTS[sheetState]);
  }, [sheetState, onHeightChange]);

  // 드래그 준비 (터치/마우스 시작 시 호출)
  const handleDragPrepare = useCallback((clientY: number) => {
    isDraggingRef.current = true;
    isDragStartedRef.current = false;
    dragStartYRef.current = clientY;
    baseTranslateYRef.current = currentTranslateYRef.current;
  }, []);

  // 드래그 중 (리렌더링 없이 DOM 직접 조작)
  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDraggingRef.current) return;

      const deltaY = dragStartYRef.current - clientY;

      // 임계값 체크 - 아직 드래그 시작 안 됐으면
      if (!isDragStartedRef.current) {
        if (Math.abs(deltaY) < DRAG_START_THRESHOLD) {
          return; // 아직 임계값 안 넘음, 클릭일 수 있음
        }
        isDragStartedRef.current = true; // 드래그 시작!
      }

      const deltaVh = (deltaY / window.innerHeight) * 100;
      const newTranslateY = baseTranslateYRef.current - deltaVh;

      // 0 ~ (max - min) 범위로 제한
      const minTranslateY = 0; // max 상태
      const maxTranslateY = SHEET_HEIGHTS.max - SHEET_HEIGHTS.min; // min 상태
      const clampedTranslateY = Math.max(minTranslateY, Math.min(newTranslateY, maxTranslateY));

      currentTranslateYRef.current = clampedTranslateY;
      updateTransform(clampedTranslateY);
    },
    [updateTransform]
  );

  // 드래그 종료 - 스냅 동작
  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    const wasDragging = isDragStartedRef.current;
    isDraggingRef.current = false;
    isDragStartedRef.current = false;

    // 실제 드래그가 발생하지 않았으면 스냅하지 않음 (클릭이었음)
    if (!wasDragging) return;

    const currentTranslateY = currentTranslateYRef.current;
    const deltaVh = baseTranslateYRef.current - currentTranslateY;
    const thresholdVh = (DRAG.THRESHOLD / window.innerHeight) * 100;

    let newState: BottomSheetState = sheetState;

    if (deltaVh > thresholdVh) {
      // 위로 드래그
      if (sheetState === 'min') newState = 'mid';
      else if (sheetState === 'mid') newState = 'max';
    } else if (deltaVh < -thresholdVh) {
      // 아래로 드래그
      if (sheetState === 'max') newState = 'mid';
      else if (sheetState === 'mid') newState = 'min';
    }

    // 새 상태로 스냅
    const targetTranslateY = getTranslateY(newState);
    currentTranslateYRef.current = targetTranslateY;
    updateTransform(targetTranslateY, true);

    // state 업데이트 (드래그 종료 시에만)
    setSheetState(newState);
  }, [sheetState, updateTransform]);

  // 헤더 영역 터치 이벤트 (드래그 임계값 적용)
  const handleHeaderTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragPrepare(e.touches[0].clientY);
    },
    [handleDragPrepare]
  );

  const handleHeaderTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDraggingRef.current) return;

      const clientY = e.touches[0].clientY;
      const deltaY = Math.abs(dragStartYRef.current - clientY);

      // 임계값 넘으면 드래그 모드 - 기본 동작 방지
      if (isDragStartedRef.current || deltaY >= DRAG_START_THRESHOLD) {
        e.preventDefault();
      }

      handleDragMove(clientY);
    },
    [handleDragMove]
  );

  const handleHeaderTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // 스크롤 영역 터치 이벤트 (max 상태에서만 스크롤, 아니면 드래그)
  const scrollTouchStartY = useRef(0);
  const isScrollDragging = useRef(false);

  const handleScrollTouchStart = useCallback(
    (e: React.TouchEvent) => {
      scrollTouchStartY.current = e.touches[0].clientY;
      isScrollDragging.current = false;

      // min 상태면 드래그 모드 (mid/max는 스크롤 허용)
      if (sheetState === 'min') {
        handleDragPrepare(e.touches[0].clientY);
        isScrollDragging.current = true;
      }
    },
    [sheetState, handleDragPrepare]
  );

  const handleScrollTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = scrollTouchStartY.current - currentY;

      // min 상태면 드래그
      if (sheetState === 'min') {
        if (isScrollDragging.current) {
          // 임계값 넘으면 기본 동작 방지
          if (isDragStartedRef.current || Math.abs(deltaY) >= DRAG_START_THRESHOLD) {
            e.preventDefault();
          }
          handleDragMove(currentY);
        }
        return;
      }

      // mid/max 상태에서 스크롤이 맨 위이고 아래로 드래그하면 시트 높이 줄이기
      if (isScrollAtTop() && deltaY < -10) {
        if (!isScrollDragging.current) {
          handleDragPrepare(currentY);
          isScrollDragging.current = true;
        }
        e.preventDefault();
        handleDragMove(currentY);
      } else if (isScrollDragging.current) {
        e.preventDefault();
        handleDragMove(currentY);
      }
      // 그 외에는 기본 스크롤 동작
    },
    [sheetState, isScrollAtTop, handleDragPrepare, handleDragMove]
  );

  const handleScrollTouchEnd = useCallback(() => {
    if (isScrollDragging.current) {
      handleDragEnd();
      isScrollDragging.current = false;
    }
  }, [handleDragEnd]);

  // 헤더 영역 마우스 이벤트 (mousedown에서 직접 글로벌 리스너 등록)
  const handleHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 인터랙티브 요소 클릭은 무시 (버튼, 입력 등)
      const target = e.target as HTMLElement;
      if (target.closest('button, input, select, a, [role="button"]')) {
        return;
      }

      handleDragPrepare(e.clientY);

      const handleMouseMove = (ev: MouseEvent) => {
        if (!isDraggingRef.current) return;

        const deltaY = Math.abs(dragStartYRef.current - ev.clientY);

        // 임계값 넘으면 드래그 모드
        if (isDragStartedRef.current || deltaY >= DRAG_START_THRESHOLD) {
          ev.preventDefault();
        }

        handleDragMove(ev.clientY);
      };

      const handleMouseUp = () => {
        handleDragEnd();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        mouseListenersRef.current = null;
      };

      // cleanup ref에 저장
      mouseListenersRef.current = { mousemove: handleMouseMove, mouseup: handleMouseUp };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [handleDragPrepare, handleDragMove, handleDragEnd]
  );

  // 컴포넌트 언마운트 시 글로벌 리스너 cleanup
  useEffect(() => {
    return () => {
      if (mouseListenersRef.current) {
        window.removeEventListener('mousemove', mouseListenersRef.current.mousemove);
        window.removeEventListener('mouseup', mouseListenersRef.current.mouseup);
        mouseListenersRef.current = null;
      }
    };
  }, []);

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

  // 현재 높이 (스크롤 영역 계산용)
  const currentHeight = SHEET_HEIGHTS[sheetState];

  return (
    <div
      ref={sheetRef}
      className="fixed right-0 left-0 z-20 rounded-t-[20px] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] sm:left-1/2 sm:w-[375px] sm:-translate-x-1/2"
      style={{
        height: `${SHEET_HEIGHTS.max}dvh`,
        bottom: `calc(${LAYOUT.BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
        transform: `translateY(${getTranslateY(sheetState)}dvh)`,
        willChange: 'transform',
      }}
    >
      {/* 헤더 영역 - 전체 드래그 가능 */}
      <div
        onTouchStart={handleHeaderTouchStart}
        onTouchMove={handleHeaderTouchMove}
        onTouchEnd={handleHeaderTouchEnd}
        onMouseDown={handleHeaderMouseDown}
      >
        {/* 드래그 핸들 */}
        <div className="flex cursor-grab justify-center pt-3 pb-2 active:cursor-grabbing">
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
      </div>

      {/* 리스트 영역 - mid/max 상태에서 스크롤 가능 */}
      <div
        ref={scrollRef}
        className="scrollbar-hide px-4"
        style={{
          height: `calc(${currentHeight}dvh - 200px)`,
          overflowY: sheetState !== 'min' ? 'auto' : 'hidden',
          touchAction: sheetState !== 'min' ? 'pan-y' : 'none',
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
