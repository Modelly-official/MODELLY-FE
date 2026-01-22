'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CalendarIcon from '@/public/icons/myRecruitment/calendar.svg';
import DotIcon from '@/public/icons/myRecruitment/dot.svg';
import ChevronRightIcon from '@/public/icons/common/chevron-right.svg';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import { formatPeriodToMonthDay } from '@/src/utils/common';
import type { DesignerRecruitmentCard } from '@/src/types/profile';

interface DesignerProfileEditRecruitmentsProps {
  openRecruitments: DesignerRecruitmentCard[];
  onEdit?: (recruitmentId: number) => void;
  onDelete?: (recruitmentId: number) => void;
  onViewAll?: () => void;
}

const isCategoryCode = (value: string) => value.includes('_');

export default function DesignerProfileEditRecruitments({
  openRecruitments,
  onEdit,
  onDelete,
  onViewAll,
}: DesignerProfileEditRecruitmentsProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const formatPeriod = (startDate: string, endDate: string) => formatPeriodToMonthDay(`${startDate} ~ ${endDate}`);

  const handleToggleMenu = (recruitmentId: number) => {
    setOpenMenuId((prev) => (prev === recruitmentId ? null : recruitmentId));
  };

  const handleCloseMenu = () => setOpenMenuId(null);

  const handleEdit = (recruitmentId: number) => {
    onEdit?.(recruitmentId);
    setOpenMenuId(null);
  };

  const handleDelete = (recruitmentId: number) => {
    onDelete?.(recruitmentId);
    setOpenMenuId(null);
  };

  return (
    <section className="rounded-2xl bg-white px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-body-1-semibold text-gray-900">모집중인 모집글</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="flex cursor-pointer items-center justify-center text-gray-800"
          aria-label="모집글 전체보기"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {openRecruitments.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-gray-100 px-4 py-6 text-center">
          <p className="text-body-2-medium text-gray-600">현재 모집중인 공고가 없습니다.</p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {openRecruitments.map((recruitment) => {
            const isMenuOpen = openMenuId === recruitment.recruitmentId;
            return (
              <div key={recruitment.recruitmentId} className="flex items-start gap-3">
                <Link href={`/myRecruitment/${recruitment.recruitmentId}`} className="flex flex-1 items-start gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-200">
                    <Image
                      src={recruitment.thumbnailUrl}
                      alt={recruitment.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 pt-1">
                    <div className="flex flex-wrap gap-1">
                      {recruitment.subCategories
                        .slice(0, 2)
                        .map((subCategory) =>
                          isCategoryCode(subCategory) ? (
                            <CategoryBadge key={subCategory} category={subCategory} />
                          ) : (
                            <CategoryBadge key={subCategory} label={subCategory} />
                          ),
                        )}
                    </div>
                    <p className="text-body-1-semibold line-clamp-2 text-gray-900">{recruitment.title}</p>
                    <div className="flex items-center gap-1 text-gray-700">
                      <CalendarIcon className="h-4 w-4 translate-y-px text-gray-700" />
                      <span className="text-body-2-medium">
                        {formatPeriod(recruitment.startDate, recruitment.deadline)}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => handleToggleMenu(recruitment.recruitmentId)}
                    className="flex h-5 w-5 cursor-pointer items-center justify-center"
                    aria-label="모집글 메뉴"
                  >
                    <DotIcon className="h-5 w-5" />
                  </button>

                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleCloseMenu();
                        }}
                      />
                      <div className="absolute top-8 right-0 z-20 min-w-[47px] overflow-hidden rounded-[10px] border border-gray-400 bg-white">
                        <button
                          type="button"
                          onClick={() => handleEdit(recruitment.recruitmentId)}
                          className="text-caption-1-medium block w-full cursor-pointer border-b border-gray-400 px-[13px] py-1.5 whitespace-nowrap text-gray-900 hover:bg-gray-100"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(recruitment.recruitmentId)}
                          className="text-caption-1-medium block w-full cursor-pointer px-[13px] py-1.5 whitespace-nowrap text-gray-900 hover:bg-gray-100"
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
