'use client';

import { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import Toast from '@/src/components/common/Toast';

interface ToastContextType {
  showToast: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

// 전역 showToast 함수를 위한 참조
let globalShowToast: ((message: string) => void) | null = null;

export function ToastProvider({ children }: ToastProviderProps) {
  const [message, setMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const showToast = useCallback((newMessage: string) => {
    // 기존 토스트가 있으면 즉시 숨기고 새 토스트 표시
    setIsVisible(false);
    setTimeout(() => {
      setMessage(newMessage);
      setIsVisible(true);
    }, 0);
  }, []);

  const hideToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  // 전역 showToast 함수 등록
  useEffect(() => {
    globalShowToast = showToast;
    return () => {
      globalShowToast = null;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {isVisible && <Toast message={message} onClose={hideToast} />}
    </ToastContext.Provider>
  );
}

// 전역에서 호출 가능한 showToast 함수
export function getGlobalShowToast() {
  return globalShowToast;
}
