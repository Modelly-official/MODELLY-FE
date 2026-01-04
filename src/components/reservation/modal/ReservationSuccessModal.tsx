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
      <div className="flex flex-col items-center gap-6">
        {/* 텍스트 영역 */}
        <div className="flex w-full flex-col items-center">
          <p className="text-center text-body-1-medium text-gray-900">
            {message}
          </p>
          {subMessage && (
            <p className="mt-2 text-center text-body-2-medium text-gray-600">
              {subMessage}
            </p>
          )}
        </div>

        {/* 확인 버튼 */}
        <button
          type="button"
          onClick={onConfirm}
          className="h-12 w-full cursor-pointer rounded-full bg-gray-900 px-4 text-body-2-medium text-white"
        >
          확인
        </button>
      </div>
    </BaseModal>
  );
}
