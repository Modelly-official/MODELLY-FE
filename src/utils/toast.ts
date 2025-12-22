import { toast } from 'sonner';

/**
 * 기본 토스트 메시지 표시
 */
export const showToast = (message: string) => {
  toast(message);
};

/**
 * 성공 토스트 메시지 표시
 */
export const showSuccessToast = (message: string) => {
  toast.success(message);
};

/**
 * 에러 토스트 메시지 표시
 */
export const showErrorToast = (message: string) => {
  toast.error(message);
};

/**
 * 정보 토스트 메시지 표시
 */
export const showInfoToast = (message: string) => {
  toast.info(message);
};

/**
 * 경고 토스트 메시지 표시
 */
export const showWarningToast = (message: string) => {
  toast.warning(message);
};
