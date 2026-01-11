'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarIcon from '@/public/icons/myRecruitment/calendar.svg';
import TimeCircleIcon from '@/public/icons/calendar/time-circle.svg';
import ChatIcon from '@/public/icons/calendar/chat.svg';
import { subCategoryCodeToName } from '@/src/utils/myRecruitment/category';
import { formatDateToShort, formatTimeWithPeriod } from '@/src/utils/common';
import {
  ReservationChangeModal,
  ReservationCancelModal,
  ReservationSuccessModal,
} from '@/src/components/reservation';
import { useCreateChatRoom } from '@/src/hooks/queries/chat';
import { useCancelReservation, useRequestReservationChange } from '@/src/hooks/queries/reservation';
import { useToast } from '@/src/hooks/common/useToast';
import type { CalendarReservationItem } from '@/src/types/calendar';
import type { ReservationChangeRequest, ReservationCancelRequest, ReservationInfo } from '@/src/types/reservation';

interface CalendarReservationCardProps {
  reservation: CalendarReservationItem;
}

/**
 * 서브카테고리 코드에서 카테고리 코드 추출
 * 예: HAIR_CUT -> HAIR, EYELASH_PERM -> EYELASH
 */
function extractCategoryFromSubCategory(subCategoryCode: string): string {
  // EYELASH는 특별 처리 (EYELASH_PERM, EYELASH_EXTENSION)
  if (subCategoryCode.startsWith('EYELASH_')) {
    return 'EYELASH';
  }
  // 나머지는 첫 번째 언더스코어 앞까지
  const underscoreIndex = subCategoryCode.indexOf('_');
  return underscoreIndex > 0 ? subCategoryCode.slice(0, underscoreIndex) : subCategoryCode;
}

/**
 * subCategories 배열을 표시 문자열로 변환
 */
function formatSubCategories(subCategories: string[]): string {
  return subCategories
    .map((code) => {
      const category = extractCategoryFromSubCategory(code);
      return subCategoryCodeToName(category, code);
    })
    .join('/');
}

export default function CalendarReservationCard({ reservation }: CalendarReservationCardProps) {
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

  // 예약 정보를 모달에 전달할 형식으로 변환
  const reservationInfo: ReservationInfo = {
    reservationId: reservation.reservationId,
    recruitmentId: reservation.recruitmentId,
    modelUserId: reservation.modelUserId,
    modelName: reservation.modelName,
    date: reservation.date,
    startTime: reservation.startTime,
  };

  // 채팅방 생성 및 이동
  const handleChatClick = () => {
    createChatRoom.mutate(reservation.modelUserId, {
      onSuccess: (response) => {
        const chatRoomId = response.result.chatRoomId;
        const query = new URLSearchParams({
          reservationId: String(reservation.reservationId),
          modelUserId: String(reservation.modelUserId),
          modelName: reservation.modelName,
          date: reservation.date,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
        });
        if (reservation.recruitmentId != null) {
          query.set('recruitmentId', String(reservation.recruitmentId));
        }
        router.push(`/chat/${chatRoomId}?${query.toString()}`);
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

  // Mock: 예약 변경 요청 처리
  const handleChangeSubmit = (data: ReservationChangeRequest) => {
    requestChange.mutate(
      { reservationId: reservation.reservationId, payload: data },
      {
        onSuccess: () => {
          setIsChangeModalOpen(false);
          setSuccessMessage('예약 변경이 요청되었습니다');
          setIsSuccessModalOpen(true);
        },
      },
    );
  };

  // Mock: 예약 취소 요청 처리
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
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4">
      {/* 고객 정보 */}
      <div className="flex flex-col gap-2">
        <p className="text-head-4-semibold text-gray-900">{reservation.modelName}님</p>

        {/* 예약 정보 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-4 text-gray-800" />
            <span className="text-body-2-medium text-gray-800">{formatDateToShort(reservation.date)}</span>
          </div>

          <span className="text-body-2-medium text-gray-800">·</span>

          <div className="flex items-center gap-1">
            <TimeCircleIcon className="size-4" />
            <span className="text-body-2-medium text-gray-800">{formatTimeWithPeriod(reservation.startTime)}</span>
          </div>

          <span className="text-body-2-medium text-gray-800">·</span>

          <span className="text-body-2-medium text-gray-800">{formatSubCategories(reservation.subCategories)}</span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleChatClick}
          disabled={createChatRoom.isPending}
          className={`flex h-[42px] items-center gap-1 whitespace-nowrap rounded-full px-3 py-[10px] ${
            createChatRoom.isPending ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer bg-gray-900'
          }`}
        >
          {createChatRoom.isPending ? (
            <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <ChatIcon className="size-5 text-white" />
          )}
          <span className="text-body-2-medium text-white">채팅 보내기</span>
        </button>

        <button
          type="button"
          onClick={handleChangeClick}
          className="flex h-[42px] cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-gray-400 bg-white px-3 py-[10px]"
        >
          <span className="text-body-2-medium text-gray-900">예약 변경</span>
        </button>

        <button
          type="button"
          onClick={handleCancelClick}
          className="flex h-[42px] cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-gray-400 bg-white px-3 py-[10px]"
        >
          <span className="text-body-2-medium text-gray-900">예약 취소</span>
        </button>
      </div>

      {/* 예약 변경 모달 */}
      {isChangeModalOpen && (
        <ReservationChangeModal
          isOpen={isChangeModalOpen}
          onClose={() => setIsChangeModalOpen(false)}
          reservation={reservationInfo}
          onSubmit={handleChangeSubmit}
          isLoading={requestChange.isPending}
        />
      )}

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
