'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { RecruitmentCard } from '@/src/components/myRecruitment/Card';
import type { MyRecruitmentListItem } from '@/src/types/myRecruitment/recruitment';

interface RecruitmentListProps {
  recruitments: MyRecruitmentListItem[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onClick?: (id: number) => void;
}

export default function RecruitmentList({ recruitments, onEdit, onDelete, onClick }: RecruitmentListProps) {
  return (
    <div className="w-full">
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-gray-40 !opacity-100',
          bulletActiveClass: '!bg-gray-90',
        }}
        spaceBetween={16}
        slidesPerView="auto"
        centeredSlides
        className="pb-8!"
      >
        {recruitments.map((recruitment) => (
          <SwiperSlide key={recruitment.recruitmentId} className="w-[286px]!">
            <RecruitmentCard recruitment={recruitment} onEdit={onEdit} onDelete={onDelete} onClick={onClick} />
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          bottom: 0 !important;
        }
        .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          margin: 0 3px !important;
        }
      `}</style>
    </div>
  );
}
