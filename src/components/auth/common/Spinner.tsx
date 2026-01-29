interface SpinnerProps {
  /** 스피너 색상 (기본값: purple) */
  color?: 'purple' | 'white' | 'gray';
  /** 스피너 크기 (기본값: md) */
  size?: 'sm' | 'md';
}

const colorStyles = {
  purple: 'border-purple-700',
  white: 'border-white',
  gray: 'border-gray-500',
};

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
};

/**
 * 로딩 스피너 컴포넌트
 */
export const Spinner = ({ color = 'purple', size = 'md' }: SpinnerProps) => (
  <div
    className={`animate-spin rounded-full border-2 border-t-transparent ${colorStyles[color]} ${sizeStyles[size]}`}
  />
);
