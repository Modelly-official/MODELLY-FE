'use client';

import Image from 'next/image';
import { useState } from 'react';

import CalendarIcon from '@/public/icons/myRecruitment/calendar.svg';
import DotIcon from '@/public/icons/myRecruitment/dot.svg';
import { CategoryBadge } from '@/src/components/common';
import type { MyRecruitmentListItem } from '@/src/types/myRecruitment/recruitment';

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

  // 카테고리 표시 코드 (서브카테고리 우선, 없으면 메인 카테고리)
  const categoryCode = recruitment.subCategories?.[0] || recruitment.category || '';

  // 날짜 표시 (API에서 period 형식으로 제공)
  const dateText = recruitment.period;

  return (
    <div className="w-[286px] cursor-pointer shadow-[0px_4px_11px_0px_rgba(34,34,34,0.06)]" onClick={handleCardClick}>
      {/* 썸네일 이미지 */}
      <div className="relative h-[286px] w-[286px] overflow-hidden rounded-t-2xl bg-gray-300">
        {recruitment.thumbnail ? (
          <Image src={recruitment.thumbnail} alt={recruitment.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-300">
            <span className="text-body-2-medium text-gray-500">이미지 없음</span>
          </div>
        )}
      </div>

      {/* 카드 정보 영역 */}
      <div className="relative flex items-start justify-between rounded-b-2xl bg-white p-4">
        <div className="flex w-[206px] flex-col gap-[9px]">
          {/* 카테고리 배지 */}
          {categoryCode && (
            <div className="flex">
              <CategoryBadge category={categoryCode} />
            </div>
          )}

          {/* 제목 */}
          <p className="text-head-4-semibold line-clamp-2 text-black">{recruitment.title}</p>

          {/* 날짜 */}
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span className="text-body-2-medium text-gray-700">{dateText}</span>
          </div>
        </div>

        {/* 더보기 버튼 */}
        <div className="relative">
          <button
            type="button"
            onClick={handleMenuClick}
            className="flex h-5 w-5 cursor-pointer items-center justify-center"
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
              <div className="absolute top-6 right-0 z-20 overflow-hidden rounded-[10px] border border-gray-400 bg-white">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="text-caption-1-medium block w-full cursor-pointer whitespace-nowrap border-b border-gray-400 px-[13px] py-[6px] text-gray-900 hover:bg-gray-100"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-caption-1-medium block w-full cursor-pointer whitespace-nowrap px-[13px] py-[6px] text-gray-900 hover:bg-gray-100"
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
