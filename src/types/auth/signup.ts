// 회원가입 관련 타입 정의

export type RoleType = 'designer' | 'model';

export interface Role {
  key: RoleType;
  label: string;
}

export interface Term {
  label: string;
  checked: boolean;
}

export interface SignupStepProps {
  goNext: () => void;
  goPrev?: () => void;
  isSocial: boolean;
}
