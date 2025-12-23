import LeftArrowIcon from '@/public/icons/common/left-arrow.svg';

interface SignupHeaderProps {
  onBack: () => void;
  totalSteps: number;
  currentStep: number;
}

export const SignupHeader: React.FC<SignupHeaderProps> = ({ onBack, totalSteps, currentStep }) => {
  return (
    <div className="mx-4">
      <div className="flex h-13 items-center">
        <button type="button" onClick={onBack} className="flex h-6 w-6 cursor-pointer items-center justify-center">
          <LeftArrowIcon />
        </button>
      </div>
      <div className="mt-1 flex gap-3">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div key={idx} className={`h-1 flex-1 rounded ${idx < currentStep ? 'bg-blue-500' : 'bg-gray-300'}`} />
        ))}
      </div>
    </div>
  );
};
