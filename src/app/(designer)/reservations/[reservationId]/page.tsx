'use client';

import { useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import {
  ReservationInfoCard,
  ApplicantInfoCard,
  RequestContentCard,
  AttachedPhotosCard,
  ReservationConfirmModal,
  ReservationRejectModal,
  ReservationDetailSkeleton,
} from '@/src/components/designerHome';
import { useReservationDetail, useConfirmReservation, useRejectReservation } from '@/src/hooks/queries/designerHome';
import { useCreateChatRoom } from '@/src/hooks/queries/chat';
import { useToast } from '@/src/hooks/common/useToast';

export default function ReservationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reservationId = Number(params.reservationId);

  // 잘못된 reservationId 처리
  if (Number.isNaN(reservationId)) {
    notFound();
  }

  const { data, isLoading } = useReservationDetail(reservationId);
  const confirmMutation = useConfirmReservation();
  const rejectMutation = useRejectReservation();
  const createChatRoom = useCreateChatRoom();
  const { showToast } = useToast();

  const reservation = data?.result;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleChatClick = () => {
    if (!reservation) return;

    createChatRoom.mutate(reservation.modelUserId, {
      onSuccess: (response) => {
        router.push(`/chat/${response.result.chatRoomId}`);
      },
      onError: () => {
        showToast('채팅방 생성에 실패했습니다');
      },
    });
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
    return <ReservationDetailSkeleton />;
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
          <ArrowLeftIcon className="size-6 text-black" />
        </button>
        {/* 우측 여백용 (오른쪽 아이콘 없음) */}
        <div className="size-6 opacity-0" />
      </header>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* 카테고리 배지 + 공고 제목 */}
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {[reservation.category, ...reservation.subCategories].map((cat) => (
              <span key={cat} className="text-caption-1-medium rounded-lg bg-purple-600 px-2 py-1 text-white">
                {cat}
              </span>
            ))}
          </div>
          <p className="text-head-4-semibold text-gray-900">{reservation.recruitmentTitle}</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* 예약 정보 카드 */}
          <ReservationInfoCard date={reservation.date} startTime={reservation.startTime} />

          {/* 신청자 정보 카드 */}
          <ApplicantInfoCard modelName={reservation.modelName} onChatClick={handleChatClick} />

          {/* 작성 내용 카드 */}
          <RequestContentCard comment={reservation.comment} />

          {/* 첨부 사진 카드 */}
          <AttachedPhotosCard imageUrl={reservation.imageUrl} />
        </div>
      </div>

      {/* 하단 버튼 (예약대기 상태에서만 표시) */}
      {reservation.status === '예약대기' && (
        <div className="fixed bottom-0 left-1/2 z-50 flex w-full -translate-x-1/2 gap-3 border-t border-gray-300 bg-white px-4 py-3 sm:w-[375px]">
          <button
            type="button"
            onClick={handleReject}
            className="text-body-1-semibold flex-1 cursor-pointer rounded-full border border-gray-400 bg-white py-4 text-gray-900"
          >
            예약 거절
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="text-body-1-semibold flex-1 cursor-pointer rounded-full bg-gray-900 py-4 text-white"
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
