'use client';

import BaseModal from '@/src/components/common/Modal/BaseModal';

interface ReservationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  subMessage?: string;
  onConfirm: () => void;
}

export default function ReservationSuccessModal({
  isOpen,
  onClose,
  message,
  subMessage,
  onConfirm,
}: ReservationSuccessModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} showCloseButton>
      <div className="flex flex-col items-center gap-[25px]">
        {/* 텍스트 영역 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-head-4-medium text-gray-90">
            {message}
          </p>
          {subMessage && (
            <p className="text-center text-body-2-medium text-gray-60">
              {subMessage}
            </p>
          )}
        </div>

        {/* 확인 버튼 */}
        <button
          type="button"
          onClick={onConfirm}
          className="w-full cursor-pointer rounded-full bg-gray-90 px-4 py-3.5 text-body-1-semibold text-white"
        >
          확인
        </button>
      </div>
    </BaseModal>
  );
}
