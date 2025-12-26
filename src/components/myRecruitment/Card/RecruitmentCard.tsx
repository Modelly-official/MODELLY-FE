'use client';

import Image from 'next/image';
import { useState } from 'react';

import CalendarIcon from '@/public/icons/myRecruitment/calendar.svg';
import DotIcon from '@/public/icons/myRecruitment/dot.svg';
import type { MyRecruitmentListItem } from '@/src/types/myRecruitment/recruitment';
import { formatDateRange } from '@/src/types/myRecruitment/recruitment';

interface RecruitmentCardProps {
  recruitment: MyRecruitmentListItem;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onClick?: (id: number) => void;
}

export default function RecruitmentCard({ recruitment, onEdit, onDelete, onClick }: RecruitmentCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onEdit?.(recruitment.recruitmentId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete?.(recruitment.recruitmentId);
  };

  const handleCardClick = () => {
    onClick?.(recruitment.recruitmentId);
  };

  // 카테고리 표시 텍스트
  const categoryText = recruitment.subCategories?.[0] || recruitment.category || '';

  // 날짜 표시
  const dateText = formatDateRange([recruitment.earliestRecruitmentDate]);

  return (
    <div
      className="w-[286px] cursor-pointer shadow-[0px_4px_11px_0px_rgba(34,34,34,0.06)]"
      onClick={handleCardClick}
    >
      {/* 썸네일 이미지 */}
      <div className="relative h-[286px] w-[286px] overflow-hidden rounded-t-2xl bg-gray-30">
        {recruitment.thumbnail ? (
          <Image
            src={recruitment.thumbnail}
            alt={recruitment.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-30">
            <span className="text-body-2-medium text-gray-50">이미지 없음</span>
          </div>
        )}
      </div>

      {/* 카드 정보 영역 */}
      <div className="relative flex items-start justify-between rounded-b-2xl bg-white p-4">
        <div className="flex w-[206px] flex-col gap-[9px]">
          {/* 카테고리 배지 */}
          {categoryText && (
            <div className="flex">
              <span className="rounded bg-purple-20 px-2 py-[2px] text-caption-1-medium text-purple-70">
                {categoryText}
              </span>
            </div>
          )}

          {/* 제목 */}
          <p className="line-clamp-2 text-head-4-semibold text-black">
            {recruitment.title}
          </p>

          {/* 날짜 */}
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span className="text-body-2-medium text-gray-70">{dateText}</span>
          </div>
        </div>

        {/* 더보기 버튼 */}
        <div className="relative">
          <button
            type="button"
            onClick={handleMenuClick}
            className="flex h-5 w-5 items-center justify-center"
            aria-label="더보기"
          >
            <DotIcon className="h-5 w-5" />
          </button>

          {/* 드롭다운 메뉴 */}
          {isMenuOpen && (
            <>
              {/* 배경 클릭 시 메뉴 닫기 */}
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
              />
              <div className="absolute right-0 top-6 z-20 overflow-hidden rounded-[10px] border border-gray-40 bg-white">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="block w-full border-b border-gray-40 px-[13px] py-[6px] text-caption-1-medium text-gray-90 hover:bg-gray-10"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="block w-full px-[13px] py-[6px] text-caption-1-medium text-gray-90 hover:bg-gray-10"
                >
                  삭제
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
