'use client';

import 'swiper/css';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { MapShopItem } from '@/src/types/map';
import type { DesignerProfileInfo, DesignerRecruitmentCard } from '@/src/types/profile';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import { useLikeToggle } from '@/src/hooks/custom/explore';
import LocationIcon from '@/public/icons/explore/location.svg';
import CloseIcon from '@/public/icons/map/close.svg';
import HeartFilledIcon from '@/public/icons/map/heart.svg';
import HeartOutlineIcon from '@/public/icons/map/heart-outline.svg';
import { LAYOUT, DRAG } from '@/src/constants/map';

interface SelectedShopCardProps {
  shop: MapShopItem;
  profile: DesignerProfileInfo;
  recruitments: DesignerRecruitmentCard[];
  onClose: () => void;
  onDesignerLikeToggle?: () => void;
  onDragOffsetChange?: (offset: number) => void;
}

export default function SelectedShopCard({
  shop,
  profile,
  recruitments,
  onClose,
  onDesignerLikeToggle,
  onDragOffsetChange,
}: SelectedShopCardProps) {
  // 첫 번째 공고 (대표 공고)
  const firstRecruitment = recruitments[0] ?? null;
  const recruitmentCount = recruitments.length;

  const { isLiked, handleClick } = useLikeToggle({
    serverValue: profile.isLiked ?? false,
    onToggle: onDesignerLikeToggle,
  });

  // DOM 참조
  const containerRef = useRef<HTMLDivElement>(null);

  // 드래그 상태 (ref로 관리 - 리렌더링 방지)
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const baseOffsetRef = useRef(0);
  const currentOffsetRef = useRef(0);

  // 스냅 상태 (state로 관리 - 드래그 종료 시에만 업데이트)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [finalOffset, setFinalOffset] = useState(0);

  // 최종 offset 변경 시 부모에게 알림
  useEffect(() => {
    onDragOffsetChange?.(finalOffset);
  }, [finalOffset, onDragOffsetChange]);

  // 공고별 썸네일 이미지 배열 생성
  const images = recruitments
    .filter((r) => r.thumbnailUrl)
    .map((r) => ({ recruitmentId: r.recruitmentId, thumbnailUrl: r.thumbnailUrl }));

  // DOM 직접 업데이트 (리렌더링 없음)
  const updateTransform = useCallback((offset: number, animate: boolean = false) => {
    if (!containerRef.current) return;
    containerRef.current.style.transition = animate ? 'transform 0.2s ease-out' : 'none';
    containerRef.current.style.transform = `translateY(${offset}px)`;
  }, []);

  // 드래그 시작
  const handleDragStart = useCallback((clientY: number) => {
    isDraggingRef.current = true;
    startYRef.current = clientY;
    baseOffsetRef.current = currentOffsetRef.current;
  }, []);

  // 드래그 중 (리렌더링 없이 DOM 직접 조작)
  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDraggingRef.current) return;

      const diff = clientY - startYRef.current;
      const newOffset = baseOffsetRef.current + diff;
      const clampedOffset = Math.max(0, Math.min(newOffset, DRAG.CARD_CONTENT_HEIGHT));

      currentOffsetRef.current = clampedOffset;
      updateTransform(clampedOffset);
    },
    [updateTransform]
  );

  // 드래그 종료 - 스냅 동작
  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const currentOffset = currentOffsetRef.current;
    let targetOffset: number;
    let collapsed: boolean;

    if (isCollapsed) {
      // 접힌 상태에서 위로 임계값 이상 드래그하면 펼치기
      if (currentOffset < DRAG.CARD_CONTENT_HEIGHT - DRAG.COLLAPSE_THRESHOLD) {
        targetOffset = 0;
        collapsed = false;
      } else {
        targetOffset = DRAG.CARD_CONTENT_HEIGHT;
        collapsed = true;
      }
    } else {
      // 펼친 상태에서 아래로 임계값 이상 드래그하면 접기
      if (currentOffset > DRAG.COLLAPSE_THRESHOLD) {
        targetOffset = DRAG.CARD_CONTENT_HEIGHT;
        collapsed = true;
      } else {
        targetOffset = 0;
        collapsed = false;
      }
    }

    // 애니메이션과 함께 스냅
    currentOffsetRef.current = targetOffset;
    updateTransform(targetOffset, true);

    // state 업데이트 (드래그 종료 시에만)
    setIsCollapsed(collapsed);
    setFinalOffset(targetOffset);
  }, [isCollapsed, updateTransform]);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragStart(e.touches[0].clientY);
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleDragMove(e.touches[0].clientY);
    },
    [handleDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientY);
    },
    [handleDragStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleDragMove(e.clientY);
    },
    [handleDragMove]
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      handleDragEnd();
    }
  }, [handleDragEnd]);

  return (
    <div
      ref={containerRef}
      className="fixed right-0 left-0 z-20 rounded-t-[20px] bg-white px-0 pt-3 pb-5 shadow-[0_0_4px_rgba(34,34,34,0.09)] sm:left-1/2 sm:w-[375px] sm:-translate-x-1/2"
      style={{
        bottom: `${LAYOUT.BOTTOM_NAV_HEIGHT}px`,
        transform: `translateY(${finalOffset}px)`,
        willChange: 'transform',
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* 드래그 핸들 */}
      <div
        className="mb-3 flex cursor-grab justify-center py-1 active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="h-1.5 w-14 rounded-[9px] bg-gray-400" />
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col gap-4">
        {/* 상단 정보 */}
        <div className="flex flex-col gap-1">
          {/* 카테고리 배지 + 버튼 */}
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-1">
              <CategoryBadge category={shop.category} variant="filled" />
              {firstRecruitment?.subCategories.slice(0, 1).map((subCategory) => (
                <CategoryBadge key={subCategory} category={subCategory} />
              ))}
              {recruitmentCount > 1 && (
                <span className="text-caption-1-medium text-gray-600">
                  +{recruitmentCount - 1}개 공고
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClick}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-gray-200"
              >
                {isLiked ? (
                  <HeartFilledIcon className="size-[18px] text-purple-500" />
                ) : (
                  <HeartOutlineIcon className="size-[18px] text-gray-600" />
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-gray-200"
              >
                <CloseIcon className="size-2.5 text-gray-800" />
              </button>
            </div>
          </div>

          {/* 제목 (첫 번째 공고 또는 샵 이름) */}
          <div className="px-4">
            {firstRecruitment ? (
              <Link href={`/post/${firstRecruitment.recruitmentId}`}>
                <h3 className="truncate text-head-3-semibold text-black">
                  {firstRecruitment.title}
                </h3>
              </Link>
            ) : (
              <h3 className="truncate text-head-3-semibold text-black">
                {profile.shop}
              </h3>
            )}
          </div>

          {/* 디자이너 정보 */}
          <div className="flex flex-col gap-1 px-4">
            <p className="text-body-2-medium text-gray-800">
              {profile.nickname} · {profile.shop}
            </p>

            {/* 위치 */}
            <div className="flex items-center gap-1">
              <LocationIcon className="h-[13.5px] w-[11.25px] text-gray-800" />
              <span className="text-body-2-medium text-gray-800">
                {profile.address.line1} {profile.address.line2}
              </span>
            </div>
          </div>
        </div>

        {/* 이미지 갤러리 (공고별 썸네일) */}
        {images.length > 0 && (
          <div className="overflow-hidden">
            <Swiper
              slidesPerView="auto"
              spaceBetween={8}
              slidesOffsetBefore={16}
              slidesOffsetAfter={16}
            >
              {images.map((image) => (
                <SwiperSlide key={image.recruitmentId} className="w-[120px]!">
                  <Link
                    href={`/post/${image.recruitmentId}`}
                    className="relative block h-[138px] w-[120px] overflow-hidden rounded-[16px] bg-gray-200"
                  >
                    <Image
                      src={image.thumbnailUrl}
                      alt="공고 이미지"
                      fill
                      sizes="120px"
                      className="pointer-events-none select-none object-cover"
                      draggable={false}
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
}
