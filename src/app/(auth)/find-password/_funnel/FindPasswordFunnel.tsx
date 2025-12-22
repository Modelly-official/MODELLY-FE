'use client';

import { useState } from 'react';
import { useFunnel } from '@/src/hooks/custom/signup/useFunnel';
import { StepInput, StepNewPassword, StepComplete, StepSocialUser } from '.';

export const FindPasswordFunnel: React.FC = () => {
  const [Funnel, setStep] = useFunnel(['input', 'new-password', 'complete', 'social-user'] as const, {
    initialStep: 'input',
  });

  // 결과 상태
  const [userName, setUserName] = useState('');
  const [userLoginId, setUserLoginId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [socialLoginType, setSocialLoginType] = useState('');

  // Step 1 -> Step 2 (일반 사용자)
  const handleGoToNewPassword = (name: string, loginId: string, email: string) => {
    setUserName(name);
    setUserLoginId(loginId);
    setUserEmail(email);
    setStep('new-password');
  };

  // Step 1 -> social-user (소셜 로그인 사용자)
  const handleGoToSocialUser = (name: string, loginType: string) => {
    setUserName(name);
    setSocialLoginType(loginType);
    setStep('social-user');
  };

  // Step 2 -> Step 3 (완료)
  const handleComplete = () => {
    setStep('complete');
  };

  return (
    <div className="relative min-h-screen bg-white">
      <Funnel>
        <Funnel.Step name="input">
          <StepInput goNext={handleGoToNewPassword} goSocialUser={handleGoToSocialUser} />
        </Funnel.Step>
        <Funnel.Step name="new-password">
          <StepNewPassword email={userEmail} goNext={handleComplete} />
        </Funnel.Step>
        <Funnel.Step name="complete">
          <StepComplete />
        </Funnel.Step>
        <Funnel.Step name="social-user">
          <StepSocialUser name={userName} loginType={socialLoginType} />
        </Funnel.Step>
      </Funnel>
    </div>
  );
};
