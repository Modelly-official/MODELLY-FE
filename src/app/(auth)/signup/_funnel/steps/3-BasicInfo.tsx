'use client';

import { useState, useEffect } from 'react';
import {
  BasicInfoInput,
  PhoneInputWithAuth,
  AuthCodeInput,
  SignupHeader,
  SignupTitle,
  FixedBottomButton,
} from '@/src/components/signup';
import { FixedBottomContainer } from '@/src/components/common/FixedBottomContainer';
import { useSignupStore } from '@/src/stores';
import { useSendSmsCode, useVerifySmsCode } from '@/src/hooks/queries';
import { validatePhoneNumber } from '@/src/utils';
import { SIGNUP_STEPS, SIGNUP_MESSAGES } from '@/src/constants/signup';
import type { SignupStepProps } from '@/src/types';

interface StepBasicInfoProps extends SignupStepProps {
  goPrev: () => void;
}

export const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ goPrev, goNext, isSocial }) => {
  const { name, phoneNumber, email, setField } = useSignupStore();
  const [authCode, setAuthCode] = useState('');
  const [authCodeError, setAuthCodeError] = useState('');
  const [authCodeValid, setAuthCodeValid] = useState<boolean | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [timer, setTimer] = useState(0);

  const sendSmsMutation = useSendSmsCode();
  const verifySmsMutation = useVerifySmsCode();

  // 타이머 로직
  useEffect(() => {
    if (timer > 0 && !authCodeValid) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, authCodeValid]);

  const handleRequestPhoneAuth = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setAuthCodeError('올바른 전화번호를 입력해주세요.');
      return;
    }

    sendSmsMutation.mutate(phoneNumber, {
      onSuccess: (response) => {
        if (response.isSuccess) {
          setRequestSent(true);
          setAuthCode('');
          setAuthCodeValid(null);
          setAuthCodeError('');
          setTimer(180); // 3분 (180초)
        } else {
          setAuthCodeError(response.message || '인증번호 발송에 실패했습니다.');
        }
      },
      onError: (error) => {
        setAuthCodeError('인증번호 발송 중 오류가 발생했습니다.');
        console.error('SMS 발송 에러:', error);
      },
    });
  };

  const handleVerifyAuthCode = () => {
    if (!authCode) {
      setAuthCodeError('인증번호를 입력해주세요.');
      return;
    }

    verifySmsMutation.mutate(
      { phoneNumber, authCode },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            setAuthCodeValid(true);
            setAuthCodeError('');
          } else {
            setAuthCodeValid(false);
            setAuthCodeError(response.message || '인증번호가 일치하지 않습니다.');
          }
        },
        onError: (error) => {
          setAuthCodeValid(false);
          setAuthCodeError('인증번호 검증 중 오류가 발생했습니다.');
          console.error('SMS 검증 에러:', error);
        },
      },
    );
  };

  if (isSocial) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <SignupHeader onBack={goPrev} totalSteps={SIGNUP_STEPS.REGULAR} currentStep={3} />
      <SignupTitle line1={SIGNUP_MESSAGES.BASIC_INFO.TITLE_1} line2={SIGNUP_MESSAGES.BASIC_INFO.TITLE_2} />
      <form
        className="mx-4 mt-8 flex w-[calc(100%-2rem)] flex-1 flex-col gap-6 pb-[250px] sm:w-[343px]"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col">
          <BasicInfoInput name={name} email={email || ''} setField={setField} />
          <div className="flex flex-col gap-2">
            <PhoneInputWithAuth
              phoneNumber={phoneNumber}
              setField={setField}
              handleRequestPhoneAuth={handleRequestPhoneAuth}
              requestSent={requestSent}
              isLoading={sendSmsMutation.isPending}
            />
            <AuthCodeInput
              authCode={authCode}
              setAuthCode={setAuthCode}
              handleVerifyAuthCode={handleVerifyAuthCode}
              authCodeError={authCodeError}
              authCodeValid={authCodeValid}
              requestSent={requestSent}
              timer={timer}
            />
          </div>
        </div>
      </form>
      <FixedBottomContainer>
        <FixedBottomButton disabled={!name || !email || !phoneNumber || !authCodeValid} onClick={goNext}>
          {SIGNUP_MESSAGES.BUTTON.NEXT}
        </FixedBottomButton>
      </FixedBottomContainer>
    </div>
  );
};
