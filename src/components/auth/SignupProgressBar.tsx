interface SignupProgressBarProps {
  totalSteps: number;
  currentStep?: number;
}

export default function SignupProgressBar({ totalSteps, currentStep = 1 }: SignupProgressBarProps) {
  return (
    <div className="flex gap-3 mt-4">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div
          key={idx}
          className={
            idx < currentStep
              ? "bg-blue-500 h-1 rounded w-[106px]"
              : "bg-gray-300 h-1 rounded w-[106px]"
          }
        />
      ))}
    </div>
  );
}
