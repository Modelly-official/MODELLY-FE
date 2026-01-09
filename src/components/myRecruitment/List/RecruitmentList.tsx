'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

import { RecruitmentCard } from '@/src/components/myRecruitment/Card';
import type { MyRecruitmentListItem } from '@/src/types/myRecruitment/recruitment';

interface RecruitmentListProps {
  recruitments: MyRecruitmentListItem[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onClick?: (id: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export default function RecruitmentList({
  recruitments,
  onEdit,
  onDelete,
  onClick,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: RecruitmentListProps) {
  // 마지막 슬라이드 근처에 도달하면 다음 페이지 로드
  const handleSlideChange = (swiper: SwiperType) => {
    const isNearEnd = swiper.activeIndex >= swiper.slides.length - 3;
    if (isNearEnd && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  };

  return (
    <div className="w-full">
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-gray-400 !opacity-100 !rounded-[3px]',
          bulletActiveClass: '!bg-gray-900 !w-5',
        }}
        spaceBetween={16}
        slidesPerView="auto"
        centeredSlides
        className="pb-8!"
        onSlideChange={handleSlideChange}
        onReachEnd={() => {
          if (hasMore && !isLoadingMore && onLoadMore) {
            onLoadMore();
          }
        }}
      >
        {recruitments.map((recruitment) => (
          <SwiperSlide key={recruitment.recruitmentId} className="w-[286px]!">
            <RecruitmentCard recruitment={recruitment} onEdit={onEdit} onDelete={onDelete} onClick={onClick} />
          </SwiperSlide>
        ))}
        {isLoadingMore && (
          <SwiperSlide className="w-[286px]! flex items-center justify-center">
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          bottom: 0 !important;
        }
        .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          margin: 0 3px !important;
          transition: width 0.2s ease;
        }
      `}</style>
    </div>
  );
}
