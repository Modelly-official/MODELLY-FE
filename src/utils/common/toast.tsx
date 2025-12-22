import { getGlobalShowToast } from '@/src/providers/ToastProvider';

/**
 * 토스트 메시지 표시
 * ToastProvider가 마운트된 후에만 사용 가능
 */
export const showToast = (message: string) => {
  const showToastFn = getGlobalShowToast();
  if (showToastFn) {
    showToastFn(message);
  } else {
    console.warn('ToastProvider가 아직 마운트되지 않았습니다.');
  }
};

