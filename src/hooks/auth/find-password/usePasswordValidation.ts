'use client';

import { useMemo } from 'react';
import { validatePassword } from '@/src/utils/auth/find-password';

/**
 * 비밀번호 검증 상태 관리 훅
 * useMemo로 계산하여 불필요한 재렌더링 방지
 */
export const usePasswordValidation = (newPassword: string, confirmPassword: string) => {
  const newPasswordError = useMemo(() => {
    if (!newPassword) return null;
    return validatePassword(newPassword) ? 'success' : 'error';
  }, [newPassword]);

  const confirmPasswordError = useMemo(() => {
    if (!confirmPassword) return null;
    return newPassword === confirmPassword ? 'success' : 'error';
  }, [newPassword, confirmPassword]);

  return {
    newPasswordError,
    confirmPasswordError,
    isValid: newPasswordError === 'success' && confirmPasswordError === 'success',
  };
};

