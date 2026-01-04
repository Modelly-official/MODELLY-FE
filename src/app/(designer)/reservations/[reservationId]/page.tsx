'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import {
  ReservationInfoCard,
  ApplicantInfoCard,
  RequestContentCard,
  AttachedPhotosCard,
  ReservationConfirmModal,
  ReservationRejectModal,
} from '@/src/components/designerHome';
import {
  useReservationDetail,
  useConfirmReservation,
  useRejectReservation,
} from '@/src/hooks/queries/designerHome';

export default function ReservationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reservationId = Number(params.reservationId);

  const { data, isLoading } = useReservationDetail(reservationId);
  const confirmMutation = useConfirmReservation();
  const rejectMutation = useRejectReservation();

  const reservation = data?.result;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleChatClick = () => {
    // TODO: 채팅방으로 이동
    if (reservation) {
      console.log('채팅방 이동:', reservation.modelUserId);
    }
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = () => {
    rejectMutation.mutate(reservationId, {
      onSuccess: () => {
        setIsRejectModalOpen(false);
        router.push('/reservations/pending');
      },
    });
  };

  const handleConfirm = () => {
    confirmMutation.mutate(reservationId, {
      onSuccess: () => {
        setIsConfirmModalOpen(true);
      },
    });
  };

  const handleConfirmModalClose = () => {
    setIsConfirmModalOpen(false);
    router.push('/reservations/pending');
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-200">
        <header className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-6 cursor-pointer items-center justify-center"
            aria-label="뒤로가기"
          >
            <ArrowLeftIcon className="h-4 text-black" />
          </button>
          <div className="size-6 opacity-0" />
        </header>
        <div className="flex-1 px-4">
          <div className="flex flex-col gap-4">
            <div className="animate-skeleton h-[120px] rounded-[12px] bg-gray-300" />
            <div className="animate-skeleton h-[80px] rounded-[12px] bg-gray-300" />
            <div className="animate-skeleton h-[100px] rounded-[12px] bg-gray-300" />
          </div>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!reservation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-200">
        <p className="text-body-1-medium text-gray-700">예약 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="h-4 text-black" />
        </button>
        {/* 우측 여백용 (오른쪽 아이콘 없음) */}
        <div className="size-6 opacity-0" />
      </header>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="flex flex-col gap-4">
          {/* 예약 정보 카드 */}
          <ReservationInfoCard
            date={reservation.date}
            startTime={reservation.startTime}
            category={reservation.subCategories[reservation.subCategories.length - 1]}
          />

          {/* 신청자 정보 카드 */}
          <ApplicantInfoCard
            modelName={reservation.modelName}
            onChatClick={handleChatClick}
          />

          {/* 신청 내용 카드 */}
          <RequestContentCard categories={reservation.subCategories} />

          {/* 첨부 사진 카드 */}
          <AttachedPhotosCard photos={reservation.photos} />
        </div>
      </div>

      {/* 하단 버튼 (PENDING 상태에서만 표시) */}
      {reservation.status === 'PENDING' && (
        <div className="fixed bottom-0 left-1/2 z-50 flex w-full -translate-x-1/2 gap-3 border-t border-gray-300 bg-white px-4 py-3 sm:w-[375px]">
          <button
            type="button"
            onClick={handleReject}
            className="flex-1 cursor-pointer rounded-full border border-gray-400 bg-white py-4 text-body-1-semibold text-gray-900"
          >
            예약 거절
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 cursor-pointer rounded-full bg-gray-900 py-4 text-body-1-semibold text-white"
          >
            예약 확정
          </button>
        </div>
      )}

      {/* 예약 확정 완료 모달 */}
      <ReservationConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleConfirmModalClose}
        onConfirm={handleConfirmModalClose}
      />

      {/* 예약 거절 확인 모달 */}
      <ReservationRejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}
