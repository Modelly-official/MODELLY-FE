interface FixedBottomButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}

export const FixedBottomButton: React.FC<FixedBottomButtonProps> = ({ onClick, disabled, children }) => {
  return (
    <button
      type="button"
      className={`text-body-1-semibold mx-auto flex w-full cursor-pointer items-center justify-center rounded-full h-14 tracking-tight sm:w-[343px] ${
        disabled ? 'bg-gray-200 text-gray-600' : 'bg-black text-white'
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
