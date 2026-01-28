export interface DropdownOption<T = string> {
  value: T;
  label: string;
}

export interface DropdownProps<T = string> {
  // 필수 Props
  options: DropdownOption<T>[];
  value: T | null | T[]; // multiple일 때 T[]
  onChange: (value: T) => void;
  placeholder?: string;

  // 라벨 관련
  label?: string;
  required?: boolean;
  disabled?: boolean;

  // 확장 기능
  variant?: 'form' | 'inline';
  size?: 'sm' | 'lg';
  scrollToSelected?: boolean;
  maxHeight?: number;
  align?: 'left' | 'right';
  multiple?: boolean; // 다중 선택 모드

  // 접근성
  ariaLabel?: string;

  // 스타일 오버라이드
  buttonClassName?: string;
}
