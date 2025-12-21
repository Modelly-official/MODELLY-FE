'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LeftArrowIcon from '@/public/icons/signup/leftarrow.svg';
import { FixedBottomButton } from '@/src/components/signup';
import { PasswordInput } from '@/src/components/signup/4-LoginInfo/PasswordInput';
import { useResetPassword } from '@/src/hooks/queries';

interface StepNewPasswordProps {
  email: string;
  goNext: () => void;
}

export const StepNewPassword: React.FC<StepNewPasswordProps> = ({ email, goNext }) => {
  const router = useRouter();

  // React Query Hook
  const resetPasswordMutation = useResetPassword();

  // 비밀번호 상태
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 유효성 상태
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // 비밀번호 유효성 검증
  const validatePassword = (password: string) => {
    // 영문 대소문자, 숫자, 특수문자(~!@#$%) 중 3종 이상 포함
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[~!@#$%]/.test(password);

    const typesCount = [hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar].filter(Boolean).length;

    if (password.length < 8 || password.length > 20) {
      return false;
    }

    if (typesCount < 3) {
      return false;
    }

    return true;
  };

  // 새 비밀번호 변경 핸들러
  useEffect(() => {
    if (newPassword === '') {
      setNewPasswordError(null);
      return;
    }

    if (validatePassword(newPassword)) {
      setNewPasswordError('success');
    } else {
      setNewPasswordError('error');
    }
  }, [newPassword]);

  // 비밀번호 확인 변경 핸들러
  useEffect(() => {
    if (confirmPassword === '') {
      setConfirmPasswordError(null);
      return;
    }

    if (newPassword === confirmPassword) {
      setConfirmPasswordError('success');
    } else {
      setConfirmPasswordError('error');
    }
  }, [newPassword, confirmPassword]);

  // 완료 버튼 활성화 조건
  const isFormValid = newPasswordError === 'success' && confirmPasswordError === 'success';

  // 비밀번호 변경 완료
  const handleComplete = useCallback(() => {
    if (!isFormValid) return;

    resetPasswordMutation.mutate(
      { email, newPassword },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            goNext();
          } else {
            alert(response.message || '비밀번호 변경에 실패했습니다.');
          }
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage = axiosError.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.';
          alert(errorMessage);
        },
      },
    );
  }, [isFormValid, email, newPassword, resetPasswordMutation, goNext]);

  // 뒤로가기
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="mt-15 mx-4">
        <button type="button" onClick={handleBack} className="w-6 h-6 flex items-center justify-center cursor-pointer">
          <LeftArrowIcon />
        </button>
      </div>

      {/* 제목 */}
      <div className="mt-4 mx-4">
        <h1 className="text-head-3-semibold text-gray-900 tracking-tight">새로운 비밀번호</h1>
      </div>

      {/* 입력 폼 */}
      <form className="flex flex-col gap-6 mt-8 mx-4 flex-1" onSubmit={(e) => e.preventDefault()}>
        {/* 새 비밀번호 입력 */}
        <PasswordInput
          label="새로운 비밀번호"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="비밀번호를 입력해주세요"
          error={newPasswordError}
          errorMessage="영문 대소문자, 숫자, 특수문자(~!@#$%) 중 3종 이상 8자 이상이어야 합니다."
          hintMessage="영문 대소문자, 숫자, 특수문자(~!@#$%) 중 3종 이상 8자 이상이어야 합니다."
          successMessage="비밀번호가 일치합니다."
        />

        {/* 비밀번호 확인 */}
        <PasswordInput
          label="비밀번호 확인"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="비밀번호를 입력해주세요"
          error={confirmPasswordError}
          errorMessage="비밀번호가 일치하지 않습니다."
          successMessage="비밀번호가 일치합니다."
        />

        {/* 하단 버튼 */}
        <div className="mt-auto mb-[42px]">
          <FixedBottomButton disabled={!isFormValid || resetPasswordMutation.isPending} onClick={handleComplete}>
            {resetPasswordMutation.isPending ? '변경 중...' : '완료'}
          </FixedBottomButton>
        </div>
      </form>
    </div>
  );
};

