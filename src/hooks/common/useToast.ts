import { useContext } from 'react';
import { ToastContext } from '@/src/providers/ToastProvider';

/**
 * 토스트 메시지를 표시하기 위한 Hook
 * ToastProvider 내부에서만 사용 가능
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}

