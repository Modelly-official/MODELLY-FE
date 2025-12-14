import LeftArrowIcon from "@/public/icons/signup/leftarrow.svg";
import SignupProgressBar from "./SignupProgressBar";

interface SignupHeaderProps {
  onBack: () => void;
  totalSteps: number;
  currentStep: number;
}

export default function SignupHeader({ onBack, totalSteps, currentStep }: SignupHeaderProps) {
  return (
    <div className="mt-15 mx-4">
      <button type="button" onClick={onBack} className="w-6 h-6 flex items-center justify-center cursor-pointer">
        <LeftArrowIcon />
      </button>
      <SignupProgressBar totalSteps={totalSteps} currentStep={currentStep} />
    </div>
  );
}
