'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { DesignerReservationItem, ReservationListType, ReservationInfo, ReservationChangeRequest, ReservationCancelRequest } from '@/src/types';
import { formatDateToKorean, formatTimeToKorean } from '@/src/utils/common';
import {
  ReservationChangeModal,
  ReservationCancelModal,
  ReservationSuccessModal,
} from '@/src/components/reservation';
import { useCreateChatRoom } from '@/src/hooks/queries/chat';
import { useRequestReservationChange, useCancelReservation } from '@/src/hooks/queries/reservation';
import { useToast } from '@/src/hooks/common/useToast';

interface DesignerReservationCardProps {
  reservation: DesignerReservationItem;
  tabType: ReservationListType;
}

export default function DesignerReservationCard({
  reservation,
  tabType,
}: DesignerReservationCardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const createChatRoom = useCreateChatRoom();
  const requestChange = useRequestReservationChange();
  const cancelReservation = useCancelReservation();

  // 모달 상태 관리
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isUpcoming = tabType === 'UPCOMING';
  const isCompleted = reservation.status === 'RESERVATION_CANCELLED' || tabType === 'COMPLETED';

  // 예약 정보를 모달에 전달할 형식으로 변환
  const reservationInfo: ReservationInfo = {
    reservationId: reservation.reservationId,
    recruitmentId: reservation.recruitmentId,
    modelUserId: reservation.modelUserId,
    modelName: reservation.modelName,
    date: reservation.date,
    startTime: reservation.startTime,
  };

  // 카드 클릭 시 공고 상세로 이동
  const handleCardClick = () => {
    router.push(`/post/${reservation.recruitmentId}`);
  };

  // 채팅방 생성 및 이동
  const handleChatClick = () => {
    createChatRoom.mutate(reservation.modelUserId, {
      onSuccess: (response) => {
        const chatRoomId = response.result.chatRoomId;
        router.push(`/chat/${chatRoomId}`);
      },
      onError: () => {
        showToast('채팅방 생성에 실패했습니다');
      },
    });
  };

  const handleChangeClick = () => {
    setIsChangeModalOpen(true);
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  // 예약 변경 요청 처리
  const handleChangeSubmit = async (data: ReservationChangeRequest) => {
    try {
      const response = await createChatRoom.mutateAsync(reservation.modelUserId);
      const roomId = response.result.chatRoomId;
      requestChange.mutate(
        { reservationId: reservation.reservationId, payload: data, roomId },
        {
          onSuccess: () => {
            setIsChangeModalOpen(false);
            setSuccessMessage('예약 변경이 요청되었습니다');
            setIsSuccessModalOpen(true);
          },
        },
      );
    } catch {
      showToast('채팅방 생성에 실패했습니다.');
    }
  };

  // 예약 취소 요청 처리
  const handleCancelSubmit = (data: ReservationCancelRequest) => {
    cancelReservation.mutate(
      { reservationId: reservation.reservationId, payload: data },
      {
        onSuccess: () => {
          setIsCancelModalOpen(false);
          setSuccessMessage('예약 취소가 요청되었습니다');
          setIsSuccessModalOpen(true);
        },
      },
    );
  };

  // 성공 모달 확인 버튼 처리
  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage('');
  };

  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white px-5 py-4">
      {/* 콘텐츠 */}
      <div className="flex flex-col gap-2">
        {/* 서브카테고리 뱃지 */}
        <div className="flex items-center gap-1">
          {reservation.subCategories.map((label) => (
            <span
              key={label}
              className="text-caption-1-medium rounded-lg bg-purple-200 px-2 py-1 text-purple-700"
            >
              {label}
            </span>
          ))}
        </div>

        {/* 제목 및 예약 정보 */}
        <div className="flex flex-col gap-4">
          {/* 제목 (클릭 가능) */}
          <button
            type="button"
            onClick={handleCardClick}
            className="flex cursor-pointer items-center gap-0.5"
          >
            <p className="text-head-4-semibold text-gray-900">{reservation.recruitmentTitle}</p>
            <Image
              src="/icons/common/chevron-right.svg"
              alt="상세보기"
              width={20}
              height={20}
              className="text-gray-800"
            />
          </button>

          {/* 예약 정보 */}
          <div className="flex flex-col gap-1">
            <div className="text-body-2-medium flex items-center gap-4">
              <span className="w-[51px] text-gray-600">예약 일시</span>
              <span className="text-gray-900">
                {formatDateToKorean(reservation.date)} {formatTimeToKorean(reservation.startTime)}
              </span>
            </div>
            <div className="text-body-2-medium flex items-center gap-4">
              <span className="w-[51px] text-gray-600">예약자 명</span>
              <span className="text-gray-900">{reservation.modelName} 님</span>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼 (다가오는 일정만) */}
      {isUpcoming && !isCompleted && (
        <div className="flex w-full items-center gap-2">
          <button
            type="button"
            onClick={handleChatClick}
            disabled={createChatRoom.isPending}
            className={`text-body-2-medium flex h-[42px] shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full px-4 py-2.5 text-white ${
              createChatRoom.isPending ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer bg-gray-900'
            }`}
          >
            {createChatRoom.isPending ? (
              <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Image src="/icons/calendar/chat.svg" alt="채팅" width={20} height={20} />
            )}
            채팅 보내기
          </button>
          <button
            type="button"
            onClick={handleChangeClick}
            className="text-body-2-medium flex h-[42px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-gray-400 bg-white px-4 py-2.5 text-gray-900"
          >
            예약 변경
          </button>
          <button
            type="button"
            onClick={handleCancelClick}
            className="text-body-2-medium flex h-[42px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-gray-400 bg-white px-4 py-2.5 text-gray-900"
          >
            예약 취소
          </button>
        </div>
      )}

      {/* 예약 변경 모달 */}
      <ReservationChangeModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        reservation={reservationInfo}
        onSubmit={handleChangeSubmit}
        isLoading={requestChange.isPending || createChatRoom.isPending}
      />

      {/* 예약 취소 모달 */}
      <ReservationCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        reservation={reservationInfo}
        onSubmit={handleCancelSubmit}
        isLoading={cancelReservation.isPending}
      />

      {/* 성공 모달 */}
      <ReservationSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
        onConfirm={handleSuccessConfirm}
      />
    </div>
  );
}
