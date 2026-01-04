'use client';

import BaseModal from '@/src/components/common/Modal/BaseModal';

interface ReservationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ReservationConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: ReservationConfirmModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} showCloseButton>
      <div className="flex flex-col items-center gap-[25px]">
        {/* 텍스트 영역 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-head-4-medium text-gray-900">
            예약이 확정되었습니다
          </p>
          <p className="text-center text-body-2-medium text-gray-600">
            예약 확정 알림은 자동으로 모델에게 전송됩니다.
          </p>
        </div>

        {/* 확인 버튼 */}
        <button
          type="button"
          onClick={onConfirm}
          className="w-full cursor-pointer rounded-full bg-gray-900 px-4 py-3.5 text-body-1-semibold text-white"
        >
          확인
        </button>
      </div>
    </BaseModal>
  );
}
