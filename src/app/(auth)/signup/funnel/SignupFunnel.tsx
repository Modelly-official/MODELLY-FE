"use client";

import { useFunnel } from "@use-funnel/browser";
// ...existing code...
import StepTerms from "./Terms";
import StepRole from "./Role";
import StepBasicInfo from "./BasicInfo";


import { useSearchParams } from "next/navigation";

export default function SignupFunnel() {
  const searchParams = useSearchParams();
  const isSocial = searchParams.get("social") === "true";

  const funnel = useFunnel<{
  terms: object;
    role: { role?: string };
    basicInfo: { name?: string; email?: string; phoneNumber?: string; emailValid?: boolean | null; authCodeValid?: boolean | null };
  }>({
    id: "signup-funnel",
    initial: { step: "terms", context: { isSocial } },
  });


  return (
    <div className="w-[375px] mx-auto bg-white font-sans min-h-screen relative">
      {funnel.step === "terms" && (
        <StepTerms
          goNext={() => funnel.history.push("role")}
          isSocial={isSocial}
        />
      )}
      {funnel.step === "role" && (
        <StepRole
          goNext={() => funnel.history.push("basicInfo")}
          goPrev={() => funnel.history.push("terms")}
          isSocial={isSocial}
        />
      )}
      {funnel.step === "basicInfo" && (
        <StepBasicInfo
          goNext={() => {/* 다음 단계로 이동 또는 회원가입 완료 처리 */}}
          goPrev={() => funnel.history.push("role")}
          isSocial={isSocial}
        />
      )}
    </div>
  );
}
