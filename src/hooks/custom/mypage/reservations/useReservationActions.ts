'use client';

import { useState, useCallback } from 'react';
import { useCreateChatRoom } from '@/src/hooks/queries/chat';
import { useRequestReservationChange, useCancelReservation } from '@/src/hooks/queries/reservation';
import { useToast } from '@/src/hooks/common/useToast';
import type { ReservationChangeRequest, ReservationCancelRequest } from '@/src/types';

interface ModalState {
  isChangeOpen: boolean;
  isCancelOpen: boolean;
  isSuccessOpen: boolean;
  successMessage: string;
}

interface UseReservationActionsParams {
  reservationId: number;
  targetUserId: number; // 모델: designerUserId, 디자이너: modelUserId
}

interface UseReservationActionsReturn {
  // 모달 상태
  modalState: ModalState;
  // 모달 열기/닫기
  openChangeModal: () => void;
  openCancelModal: () => void;
  closeChangeModal: () => void;
  closeCancelModal: () => void;
  closeSuccessModal: () => void;
  // 핸들러
  handleChangeSubmit: (data: ReservationChangeRequest) => Promise<void>;
  handleCancelSubmit: (data: ReservationCancelRequest) => void;
  // 로딩 상태
  isChangeLoading: boolean;
  isCancelLoading: boolean;
}

/**
 * 예약 변경/취소 공통 로직을 관리하는 커스텀 훅
 * ModelReservationCard, DesignerReservationCard에서 공통으로 사용
 */
export function useReservationActions({
  reservationId,
  targetUserId,
}: UseReservationActionsParams): UseReservationActionsReturn {
  const { showToast } = useToast();
  const createChatRoom = useCreateChatRoom();
  const requestChange = useRequestReservationChange();
  const cancelReservation = useCancelReservation();

  // 모달 상태
  const [modalState, setModalState] = useState<ModalState>({
    isChangeOpen: false,
    isCancelOpen: false,
    isSuccessOpen: false,
    successMessage: '',
  });

  // 모달 열기/닫기 핸들러
  const openChangeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isChangeOpen: true }));
  }, []);

  const openCancelModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isCancelOpen: true }));
  }, []);

  const closeChangeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isChangeOpen: false }));
  }, []);

  const closeCancelModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isCancelOpen: false }));
  }, []);

  const closeSuccessModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isSuccessOpen: false, successMessage: '' }));
  }, []);

  // 성공 모달 표시
  const showSuccessModal = useCallback((message: string) => {
    setModalState((prev) => ({
      ...prev,
      isSuccessOpen: true,
      successMessage: message,
    }));
  }, []);

  // 예약 변경 제출
  const handleChangeSubmit = useCallback(
    async (data: ReservationChangeRequest) => {
      try {
        const response = await createChatRoom.mutateAsync(targetUserId);
        const roomId = response.result.chatRoomId;
        requestChange.mutate(
          { reservationId, payload: data, roomId },
          {
            onSuccess: () => {
              closeChangeModal();
              showSuccessModal('예약 변경이 요청되었습니다');
            },
          },
        );
      } catch {
        showToast('채팅방 생성에 실패했습니다.');
      }
    },
    [reservationId, targetUserId, createChatRoom, requestChange, closeChangeModal, showSuccessModal, showToast],
  );

  // 예약 취소 제출
  const handleCancelSubmit = useCallback(
    (data: ReservationCancelRequest) => {
      cancelReservation.mutate(
        { reservationId, payload: data },
        {
          onSuccess: () => {
            closeCancelModal();
            showSuccessModal('예약 취소가 요청되었습니다');
          },
        },
      );
    },
    [reservationId, cancelReservation, closeCancelModal, showSuccessModal],
  );

  return {
    modalState,
    openChangeModal,
    openCancelModal,
    closeChangeModal,
    closeCancelModal,
    closeSuccessModal,
    handleChangeSubmit,
    handleCancelSubmit,
    isChangeLoading: requestChange.isPending || createChatRoom.isPending,
    isCancelLoading: cancelReservation.isPending,
  };
}
