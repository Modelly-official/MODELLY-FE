type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export default function Toggle({ checked, onChange, disabled = false, className = '' }: ToggleProps) {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={`
        relative h-[28px] w-[48px] shrink-0 cursor-pointer rounded-full transition-colors duration-200
        ${checked ? 'bg-purple-500' : 'bg-gray-500'}
        ${disabled ? 'cursor-not-allowed opacity-70' : ''}
        ${className}
      `}
    >
      <span
        className={`
          absolute top-1 size-[20px] rounded-full bg-white shadow-sm transition-all duration-200
          ${checked ? 'left-[24px]' : 'left-1'}
        `}
      />
    </button>
  );
}
