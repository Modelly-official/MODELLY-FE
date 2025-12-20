interface FixedBottomButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}

export const FixedBottomButton: React.FC<FixedBottomButtonProps> = ({ onClick, disabled, children }) => {
  return (
    <button
      type="button"
      className={`w-[343px] mx-auto py-4 cursor-pointer rounded-full flex items-center justify-center text-body-1-semibold tracking-tight ${
        disabled ? 'bg-gray-200 text-gray-600' : 'bg-black text-white'
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
