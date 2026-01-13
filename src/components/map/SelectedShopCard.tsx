'use client';

import 'swiper/css';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { MapShopItem } from '@/src/types/map';
import type { RecruitmentListItem } from '@/src/types';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import { formatDistrict } from '@/src/utils/common';
import { useLikeToggle } from '@/src/hooks/custom/explore';
import { RatingDisplay, DistanceDisplay } from '@/src/components/explore/Cards/shared';
import LocationIcon from '@/public/icons/explore/location.svg';
import CloseIcon from '@/public/icons/map/close.svg';
import HeartFilledIcon from '@/public/icons/map/heart.svg';
import HeartOutlineIcon from '@/public/icons/map/heart-outline.svg';

// BottomNav 높이 (px)
const BOTTOM_NAV_HEIGHT = 76;
// 카드 높이 (핸들 제외, 콘텐츠 영역)
const CARD_CONTENT_HEIGHT = 230;
// 접힌 상태로 전환하기 위한 드래그 임계값
const COLLAPSE_THRESHOLD = 100;

interface SelectedShopCardProps {
  shop: MapShopItem;
  recruitment: RecruitmentListItem;
  onClose: () => void;
  onLikeToggle?: () => void;
  onDragOffsetChange?: (offset: number) => void;
}

export default function SelectedShopCard({
  shop: _shop, // TODO: API 연결 시 샵 정보로 공고 조회
  recruitment,
  onClose,
  onLikeToggle,
  onDragOffsetChange,
}: SelectedShopCardProps) {
  const { isLiked, handleClick } = useLikeToggle({
    serverValue: recruitment.isLiked ?? false,
    onToggle: onLikeToggle,
  });

  // 드래그 상태 관리
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const startYRef = useRef(0);
  const baseOffsetRef = useRef(0); // 접힌 상태에서의 기준 오프셋

  // 드래그 오프셋 변경 시 부모에게 알림
  useEffect(() => {
    onDragOffsetChange?.(dragOffset);
  }, [dragOffset, onDragOffsetChange]);

  // 이미지 배열 생성 (썸네일 + 추가 이미지)
  const images = recruitment.recruitmentThumbnail
    ? [recruitment.recruitmentThumbnail, recruitment.recruitmentThumbnail, recruitment.recruitmentThumbnail]
    : [];

  // 드래그 시작
  const handleDragStart = (clientY: number) => {
    startYRef.current = clientY;
    baseOffsetRef.current = isCollapsed ? CARD_CONTENT_HEIGHT : 0;
    setIsDragging(true);
  };

  // 드래그 중
  const handleDragMove = (clientY: number) => {
    if (!isDragging) return;
    const diff = clientY - startYRef.current;
    const newOffset = baseOffsetRef.current + diff;

    // 0 ~ CARD_CONTENT_HEIGHT 범위로 제한
    const clampedOffset = Math.max(0, Math.min(newOffset, CARD_CONTENT_HEIGHT));
    setDragOffset(clampedOffset);
  };

  // 드래그 종료 - 스냅 동작
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // 현재 오프셋 기준으로 스냅 결정
    if (isCollapsed) {
      // 접힌 상태에서 위로 임계값 이상 드래그하면 펼치기
      if (dragOffset < CARD_CONTENT_HEIGHT - COLLAPSE_THRESHOLD) {
        setIsCollapsed(false);
        setDragOffset(0);
      } else {
        setDragOffset(CARD_CONTENT_HEIGHT);
      }
    } else {
      // 펼친 상태에서 아래로 임계값 이상 드래그하면 접기
      if (dragOffset > COLLAPSE_THRESHOLD) {
        setIsCollapsed(true);
        setDragOffset(CARD_CONTENT_HEIGHT);
      } else {
        setDragOffset(0);
      }
    }
  };

  // 터치 이벤트 핸들러 (핸들에서 시작)
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  };

  // 터치 이벤트 핸들러 (컨테이너에서 처리)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleDragMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // 마우스 이벤트 핸들러 (핸들에서 시작)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientY);
  };

  // 마우스 이벤트 핸들러 (컨테이너에서 처리)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleDragMove(e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  return (
    <div
      className="absolute right-0 left-0 z-20 rounded-t-[20px] bg-white px-0 pt-3 pb-5 shadow-[0_0_4px_rgba(34,34,34,0.09)]"
      style={{
        bottom: `${BOTTOM_NAV_HEIGHT}px`,
        transform: `translateY(${dragOffset}px)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
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
              <CategoryBadge category={recruitment.category} variant="filled" />
              {recruitment.subCategories.slice(0, 1).map((subCategory) => (
                <CategoryBadge key={subCategory} category={subCategory} />
              ))}
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

          {/* 제목 */}
          <div className="px-4">
            <Link href={`/post/${recruitment.recruitmentId}`}>
              <h3 className="truncate text-head-3-semibold text-black">
                {recruitment.title}
              </h3>
            </Link>
          </div>

          {/* 디자이너 정보 */}
          <div className="flex flex-col gap-1 px-4">
            <p className="text-body-2-medium text-gray-800">
              {recruitment.designerName} · {recruitment.shop}
            </p>

            {/* 위치 */}
            <div className="flex items-center gap-1">
              <LocationIcon className="h-[13.5px] w-[11.25px] text-gray-800" />
              <span className="text-body-2-medium text-gray-800">
                {formatDistrict(recruitment.shopAddress)}
              </span>
            </div>

            {/* 별점 및 거리 */}
            <div className="flex items-center gap-1.5">
              <RatingDisplay
                rating={recruitment.averageRating}
                reviewCount={recruitment.reviewCount}
              />
              {recruitment.distance != null && (
                <>
                  <span className="text-body-2-medium text-gray-800">·</span>
                  <DistanceDisplay distance={recruitment.distance} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* 이미지 갤러리 (Swiper 캐러셀) */}
        {images.length > 0 && (
          <div className="px-4">
            <Swiper
              slidesPerView="auto"
              spaceBetween={8}
              className="overflow-visible!"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index} className="w-[120px]!">
                  <Link
                    href={`/post/${recruitment.recruitmentId}`}
                    className="relative block h-[138px] w-[120px] overflow-hidden rounded-[16px] bg-gray-200"
                  >
                    <Image
                      src={image}
                      alt={`${recruitment.title} 이미지 ${index + 1}`}
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
