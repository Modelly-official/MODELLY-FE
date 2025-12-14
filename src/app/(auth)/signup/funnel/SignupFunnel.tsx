"use client";

import { useFunnel } from "@/src/hooks/signup/useFunnel";
import StepTerms from "./Terms";
import StepRole from "./Role";
import StepBasicInfo from "./BasicInfo";

interface SignupFunnelProps {
  isSocial: boolean;
}

export default function SignupFunnel({ isSocial }: SignupFunnelProps) {
  const [Funnel, setStep] = useFunnel(["terms", "role", "basicInfo"] as const, {
    initialStep: "terms",
  });

  return (
    <div className="w-[375px] mx-auto bg-white min-h-screen relative">
      <Funnel>
        <Funnel.Step name="terms">
          <StepTerms
            goNext={() => setStep("role")}
            isSocial={isSocial}
          />
        </Funnel.Step>
        <Funnel.Step name="role">
          <StepRole
            goNext={() => setStep("basicInfo")}
            goPrev={() => setStep("terms")}
            isSocial={isSocial}
          />
        </Funnel.Step>
        <Funnel.Step name="basicInfo">
          <StepBasicInfo
            goNext={() => {/* 다음 단계로 이동 또는 회원가입 완료 처리 */}}
            goPrev={() => setStep("role")}
            isSocial={isSocial}
          />
        </Funnel.Step>
      </Funnel>
    </div>
  );
}