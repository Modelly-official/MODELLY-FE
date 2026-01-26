'use client';

import Image from 'next/image';
import { useState } from 'react';

import CalendarIcon from '@/public/icons/myRecruitment/calendar.svg';
import { CategoryBadge } from '@/src/components/common';
import KebabMenu from '@/src/components/common/KebabMenu/KebabMenu';
import type { MyRecruitmentListItem } from '@/src/types/myRecruitment/recruitment';
import { formatPeriodToMonthDay } from '@/src/utils/common';

interface RecruitmentCardProps {
  recruitment: MyRecruitmentListItem;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onClick?: (id: number) => void;
}

const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 2000;

export default function RecruitmentCard({ recruitment, onEdit, onDelete, onClick }: RecruitmentCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [imageKey, setImageKey] = useState(0); // 이미지 리렌더링용 key

  const handleCardClick = () => {
    onClick?.(recruitment.recruitmentId);
  };

  // 서브카테고리 배열 (API에서 subCategory로 반환)
  const subCategories = recruitment.subCategory || [];

  // 날짜 표시 (M.D~M.D 형식)
  const dateText = formatPeriodToMonthDay(recruitment.period);

  return (
    <div className="w-[286px] cursor-pointer shadow-[0px_4px_11px_0px_rgba(34,34,34,0.06)]" onClick={handleCardClick}>
      {/* 썸네일 이미지 */}
      <div className="relative h-[286px] w-[286px] overflow-hidden rounded-t-2xl bg-gray-200">
        {recruitment.thumbnail && !imageError ? (
          <>
            {/* 로딩 스켈레톤 */}
            {isImageLoading && (
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, #e5e5e5 25%, #d4d4d4 50%, #e5e5e5 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-shimmer 1.2s ease-in-out infinite',
                }}
              />
            )}
            <Image
              key={imageKey}
              src={recruitment.thumbnail}
              alt={recruitment.title}
              fill
              sizes="286px"
              className={`pointer-events-none object-cover transition-opacity select-none ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
              draggable={false}
              onLoad={() => {
                setIsImageLoading(false);
                setImageError(false);
              }}
              onError={() => {
                if (retryCount < MAX_RETRY_COUNT) {
                  // 재시도: 2초 후 이미지 다시 로드
                  setTimeout(() => {
                    setRetryCount((prev) => prev + 1);
                    setImageKey((prev) => prev + 1);
                  }, RETRY_DELAY_MS);
                } else {
                  // 최대 재시도 횟수 초과
                  setImageError(true);
                  setIsImageLoading(false);
                }
              }}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-body-2-medium text-gray-500">
              {imageError ? '이미지를 불러올 수 없습니다' : '이미지 없음'}
            </span>
          </div>
        )}
      </div>

      {/* 카드 정보 영역 */}
      <div className="relative flex items-start justify-between rounded-b-2xl bg-white p-4">
        <div className="flex w-[206px] flex-col gap-[9px]">
          {/* 카테고리 배지 */}
          {subCategories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {subCategories.map((category) => (
                <CategoryBadge key={category} category={category} />
              ))}
            </div>
          )}

          {/* 제목 */}
          <p className="text-head-4-semibold line-clamp-2 text-black">{recruitment.title}</p>

          {/* 날짜 */}
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4 text-gray-700" />
            <span className="text-body-2-medium text-gray-700">{dateText}</span>
          </div>
        </div>

        {/* 더보기 버튼 */}
        <KebabMenu
          items={[
            { label: '수정', onClick: () => onEdit?.(recruitment.recruitmentId) },
            { label: '삭제', onClick: () => onDelete?.(recruitment.recruitmentId) },
          ]}
        />
      </div>
    </div>
  );
}
