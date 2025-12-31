import { useState, useCallback } from 'react';

interface UseDeleteModalReturn<T> {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 선택된 아이템 ID */
  selectedId: T | null;
  /** 모달 열기 (삭제할 아이템 ID 전달) */
  openModal: (id: T) => void;
  /** 모달 닫기 (상태 초기화) */
  closeModal: () => void;
}

/**
 * 삭제 확인 모달 상태를 관리하는 hook
 * - 모달 열림/닫힘 상태
 * - 삭제 대상 아이템 ID 관리
 * - 제네릭 타입으로 다양한 ID 타입 지원
 */
export function useDeleteModal<T = number>(): UseDeleteModalReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<T | null>(null);

  const openModal = useCallback((id: T) => {
    setSelectedId(id);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedId(null);
  }, []);

  return {
    isOpen,
    selectedId,
    openModal,
    closeModal,
  };
}
