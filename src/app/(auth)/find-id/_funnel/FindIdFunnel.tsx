'use client';

import { useState } from 'react';
import { useFunnel } from '@/src/hooks/custom/signup/useFunnel';
import { StepInput, StepComplete } from '.';

export const FindIdFunnel: React.FC = () => {
  const [Funnel, setStep] = useFunnel(['input', 'complete'] as const, {
    initialStep: 'input',
  });

  // 결과 상태
  const [resultName, setResultName] = useState('');
  const [resultLoginId, setResultLoginId] = useState('');

  const handleComplete = (name: string, loginId: string) => {
    setResultName(name);
    setResultLoginId(loginId);
    setStep('complete');
  };

  return (
    <div className="bg-white min-h-screen relative">
      <Funnel>
        <Funnel.Step name="input">
          <StepInput goNext={handleComplete} />
        </Funnel.Step>
        <Funnel.Step name="complete">
          <StepComplete name={resultName} loginId={resultLoginId} />
        </Funnel.Step>
      </Funnel>
    </div>
  );
};

