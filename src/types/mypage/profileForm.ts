// 프로필 수정 폼 관련 타입

export type UserRole = 'model' | 'designer';

// 프로필 수정 폼 상태 (UI용 - 한글/display 형식)
export interface ProfileEditFormState {
  nickname: string;
  gender: string; // '남자' | '여자' | ''
  birthDate: string; // 'YYYY.MM.DD'
  intro: string;
  storeName: string;
  address: string;
  detailAddress: string;
  category: string; // '헤어' | '네일' | '타투' | '속눈썹'
  profileImage: string | null;
}

// 폼 초기값
export const PROFILE_EDIT_INITIAL_STATE: ProfileEditFormState = {
  nickname: '',
  gender: '',
  birthDate: '',
  intro: '',
  storeName: '',
  address: '',
  detailAddress: '',
  category: '',
  profileImage: null,
};
