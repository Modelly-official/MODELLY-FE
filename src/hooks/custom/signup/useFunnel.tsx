import { ReactElement, ReactNode, useState, useMemo, createContext, useContext } from 'react';

// 현재 스텝을 공유하기 위한 Context
const FunnelContext = createContext<string | null>(null);

// Step 컴포넌트를 컴포넌트 외부에서 정의하여 참조 안정성 확보
function StepComponent<Steps extends readonly string[]>({
  name,
  children,
}: {
  name: Steps[number];
  children: ReactNode;
}): ReactElement | null {
  const currentStep = useContext(FunnelContext);
  return currentStep === name ? <>{children}</> : null;
}

// Funnel 래퍼 컴포넌트
function FunnelWrapper({
  children,
  currentStep,
}: {
  children: ReactNode;
  currentStep: string;
}) {
  return <FunnelContext.Provider value={currentStep}>{children}</FunnelContext.Provider>;
}

export function useFunnel<Steps extends readonly string[]>(steps: Steps, options: { initialStep: Steps[number] }) {
  const [currentStep, setCurrentStep] = useState<Steps[number]>(options.initialStep);

  // FunnelComponent를 useMemo로 메모이제이션
  const FunnelComponent = useMemo(() => {
    const Funnel = ({ children }: { children: ReactNode }) => (
      <FunnelWrapper currentStep={currentStep}>{children}</FunnelWrapper>
    );
    // Step을 Funnel의 정적 속성으로 할당
    Funnel.Step = StepComponent<Steps>;
    return Funnel;
  }, [currentStep]);

  return [FunnelComponent, setCurrentStep] as const;
}
