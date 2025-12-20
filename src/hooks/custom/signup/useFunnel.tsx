import { ReactElement, ReactNode, useState } from 'react';

export function useFunnel<Steps extends readonly string[]>(steps: Steps, options: { initialStep: Steps[number] }) {
  const [currentStep, setCurrentStep] = useState<Steps[number]>(options.initialStep);

  const Step = ({ name, children }: { name: Steps[number]; children: ReactNode }): ReactElement | null => {
    return currentStep === name ? <>{children}</> : null;
  };

  const FunnelComponent = Object.assign(({ children }: { children: ReactNode }) => <>{children}</>, { Step });

  return [FunnelComponent, setCurrentStep] as const;
}
