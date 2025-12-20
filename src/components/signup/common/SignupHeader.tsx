import LeftArrowIcon from '@/public/icons/signup/leftarrow.svg';

interface SignupHeaderProps {
  onBack: () => void;
  totalSteps: number;
  currentStep: number;
}

export const SignupHeader: React.FC<SignupHeaderProps> = ({ onBack, totalSteps, currentStep }) => {
  return (
    <div className="mt-15 mx-4">
      <button type="button" onClick={onBack} className="w-6 h-6 flex items-center justify-center cursor-pointer">
        <LeftArrowIcon />
      </button>
      <div className="flex gap-3 mt-4">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div key={idx} className={`h-1 rounded flex-1 ${idx < currentStep ? 'bg-blue-500' : 'bg-gray-300'}`} />
        ))}
      </div>
    </div>
  );
};
