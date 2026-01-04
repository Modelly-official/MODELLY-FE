'use client';

import BaseModal from '@/src/components/common/Modal/BaseModal';

interface ReservationRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ReservationRejectModal({
  isOpen,
  onClose,
  onConfirm,
}: ReservationRejectModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} showCloseButton>
      <div className="flex flex-col items-center gap-[25px]">
        {/* 텍스트 영역 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-head-4-medium text-gray-900">
            예약을 거절하시겠습니까?
          </p>
          <p className="text-center text-body-2-medium text-gray-600">
            거절 시 모델에게 알림이 전송됩니다.
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-full border border-gray-400 bg-white py-3.5 text-body-1-semibold text-gray-900"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-full bg-gray-900 py-3.5 text-body-1-semibold text-white"
          >
            거절
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
