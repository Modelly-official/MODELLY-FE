'use client';

import CloseIcon from '@/public/icons/common/close.svg';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, isLoading = false }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,28,30,0.4)]" onClick={onClose}>
      <div className="relative w-[311px] rounded-[20px] bg-white px-5 pt-4 pb-6" onClick={(e) => e.stopPropagation()}>
        {/* X 닫기 버튼 */}
        <div className="flex justify-end pb-1">
          <button type="button" onClick={onClose} className="cursor-pointer p-1">
            <CloseIcon className="h-3 w-3" />
          </button>
        </div>

        {/* 안내 텍스트 */}
        <div className="mb-6 text-center">
          <p className="text-body-1-medium tracking-tight text-gray-900">모집글을 삭제하시겠습니까?</p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-2">
          {/* 취소 버튼 */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-body-2-medium h-12 flex-1 cursor-pointer rounded-full border border-gray-400 bg-white tracking-tight text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>

          {/* 삭제 버튼 */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="text-body-2-medium h-12 flex-1 cursor-pointer rounded-full bg-gray-900 tracking-tight text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}
