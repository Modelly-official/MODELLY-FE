/**
 * 토스트 메시지 표시
 * ToastProvider가 마운트된 후에만 사용 가능
 * Provider 내부에서 window 객체에 등록된 함수를 호출
 */
export const showToast = (message: string) => {
  if (typeof window !== 'undefined' && window.__toastShowFn) {
    window.__toastShowFn(message);
  } else {
    console.warn('ToastProvider가 아직 마운트되지 않았습니다.');
  }
};
