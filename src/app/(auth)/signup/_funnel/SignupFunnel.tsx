"use client";

import { useFunnel } from "@/src/hooks/signup/useFunnel";
import { 
  StepTerms, 
  StepRole, 
  StepBasicInfo, 
  StepLoginInfo, 
  StepProfileInfo, 
  StepComplete 
} from ".";

interface SignupFunnelProps {
  isSocial: boolean;
}

export const SignupFunnel: React.FC<SignupFunnelProps> = ({ isSocial }) => {
  const [Funnel, setStep] = useFunnel(["terms", "role", "basicInfo", "loginInfo", "profileInfo", "complete"] as const, {
    initialStep: "terms",
  });

  return (
    <div className="bg-white min-h-screen relative">
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
};