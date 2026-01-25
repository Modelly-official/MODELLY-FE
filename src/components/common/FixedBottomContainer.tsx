interface FixedBottomContainerProps {
  children: React.ReactNode;
  hasBorder?: boolean;
  className?: string;
}

export function FixedBottomContainer({
  children,
  hasBorder = false,
  className = '',
}: FixedBottomContainerProps) {
  return (
    <div
      className={`fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 bg-white px-4 pt-3 pb-[calc(4px+env(safe-area-inset-bottom))] sm:w-[375px] ${hasBorder ? 'border-t border-gray-100' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
