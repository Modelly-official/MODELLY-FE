"use client";

import { useFunnel } from "@/src/hooks/signup/useFunnel";
import StepTerms from "./Terms";
import StepRole from "./Role";
import StepBasicInfo from "./BasicInfo";
import StepLoginInfo from "./LoginInfo";
import StepProfileInfo from "./ProfileInfo";
import StepComplete from "./Complete";

interface SignupFunnelProps {
  isSocial: boolean;
}

export default function SignupFunnel({ isSocial }: SignupFunnelProps) {
  const [Funnel, setStep] = useFunnel(["terms", "role", "basicInfo", "loginInfo", "profileInfo", "complete"] as const, {
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
            goNext={() => setStep(isSocial ? "profileInfo" : "basicInfo")}
            goPrev={() => setStep("terms")}
            isSocial={isSocial}
          />
        </Funnel.Step>
        <Funnel.Step name="basicInfo">
          <StepBasicInfo
            goNext={() => setStep("loginInfo")}
            goPrev={() => setStep("role")}
            isSocial={isSocial}
          />
        </Funnel.Step>
        <Funnel.Step name="loginInfo">
          <StepLoginInfo
            goNext={() => setStep("profileInfo")}
            goPrev={() => setStep("basicInfo")}
            isSocial={isSocial}
          />
        </Funnel.Step>
        <Funnel.Step name="profileInfo">
          <StepProfileInfo
            goNext={() => setStep("complete")}
            goPrev={() => setStep(isSocial ? "role" : "loginInfo")}
            isSocial={isSocial}
          />
        </Funnel.Step>
        <Funnel.Step name="complete">
          <StepComplete />
        </Funnel.Step>
      </Funnel>
    </div>
  );
}