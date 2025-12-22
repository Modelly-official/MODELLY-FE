'use client';

import { createContext, useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import Toast from '@/src/components/common/Toast';

interface ToastContextType {
  showToast: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

// window 객체에 타입 선언 추가
declare global {
  interface Window {
    __toastShowFn?: (message: string) => void;
  }
}

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

  // Provider 내부에서 window 객체에 showToast 등록 (SSR 안전)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__toastShowFn = showToast;
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.__toastShowFn = undefined;
      }
    };
  }, [showToast]);

  // Context value 메모이제이션으로 불필요한 리렌더 방지
  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {isVisible && <Toast message={message} onClose={hideToast} />}
    </ToastContext.Provider>
  );
}
