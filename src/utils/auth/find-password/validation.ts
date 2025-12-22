export * from '../find-id/validation';

/**
 * 비밀번호 유효성 검증
 * 영문 대소문자, 숫자, 특수문자(~!@#$%) 중 3종 이상 포함
 * 8자 이상 20자 이하
 */
export const validatePassword = (password: string): boolean => {
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[~!@#$%]/.test(password);

  const typesCount = [hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar].filter(Boolean).length;

  return password.length >= 8 && password.length <= 20 && typesCount >= 3;
};

