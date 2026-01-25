'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FixedBottomButton } from '@/src/components/signup';
import { PasswordInput } from '@/src/components/common';
import { useResetPassword } from '@/src/hooks/queries';
import { usePasswordValidation } from '@/src/hooks/auth/find-password';
import { AuthHeader } from '@/src/components/auth';
import { showToast } from '@/src/utils';

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

  // Custom Hook - 비밀번호 검증
  const { newPasswordError, confirmPasswordError, isValid } = usePasswordValidation(newPassword, confirmPassword);

  // 비밀번호 변경 완료
  const handleComplete = useCallback(() => {
    if (!isValid) return;

    resetPasswordMutation.mutate(
      { email, newPassword },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            goNext();
          } else {
            showToast(response.message || '비밀번호 변경 실패');
          }
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage = axiosError.response?.data?.message || '비밀번호 변경 오류';
          showToast(errorMessage);
        },
      },
    );
  }, [isValid, email, newPassword, resetPasswordMutation, goNext]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <AuthHeader onBack={() => router.back()} />

      {/* 제목 */}
      <div className="mx-4 mt-4">
        <h1 className="text-body-1-medium tracking-tight">새로운 비밀번호</h1>
      </div>

      {/* 입력 폼 */}
      <form className="mx-4 mt-8 flex flex-1 flex-col gap-6 pb-[100px]" onSubmit={(e) => e.preventDefault()}>
        {/* 새 비밀번호 입력 */}
        <PasswordInput
          label="새로운 비밀번호"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="비밀번호를 입력해주세요"
          status={newPasswordError === 'success' ? 'success' : newPasswordError ? 'error' : 'default'}
          message={
            newPasswordError === 'success'
              ? '사용 가능한 비밀번호입니다.'
              : '영문 대소문자, 숫자, 특수문자(~!@#^*) 조합 8자 이상이어야 합니다.'
          }
        />

        {/* 비밀번호 확인 */}
        <PasswordInput
          label="비밀번호 확인"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="비밀번호를 입력해주세요"
          status={confirmPasswordError === 'success' ? 'success' : confirmPasswordError ? 'error' : 'default'}
          message={
            confirmPasswordError === 'success'
              ? '비밀번호가 일치합니다.'
              : confirmPasswordError
                ? '비밀번호가 일치하지 않습니다.'
                : undefined
          }
        />

      </form>
      {/* 하단 버튼 */}
      <div className="fixed bottom-[calc(20px+env(safe-area-inset-bottom))] left-4 right-4">
        <FixedBottomButton disabled={!isValid || resetPasswordMutation.isPending} onClick={handleComplete}>
          {resetPasswordMutation.isPending ? '변경 중...' : '완료'}
        </FixedBottomButton>
      </div>
    </div>
  );
};
