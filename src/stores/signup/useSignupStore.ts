import { create } from 'zustand';

const DEFAULT_TERMS = [
  { label: '[필수] 이용약관 동의', checked: false },
  { label: '[선택] 개인정보 수집 및 이용 동의', checked: false },
  { label: '[선택] 광고성 정보 수신 동의', checked: false },
] as const;

export type SignupStoreField =
  | 'name'
  | 'email'
  | 'phoneNumber'
  | 'role'
  | 'username'
  | 'password'
  | 'passwordConfirm'
  | 'nickname'
  | 'gender'
  | 'birthDate'
  | 'intro'
  | 'storeName'
  | 'address'
  | 'detailAddress'
  | 'category';

interface TermsAgreement {
  label: string;
  checked: boolean;
}

interface SignupStore {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  username: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  gender: string;
  birthDate: string;
  intro: string;
  storeName: string;
  address: string;
  detailAddress: string;
  category: string;
  profileImage: string | null;
  terms: TermsAgreement[];
  emailValid: boolean | null;
  emailError: string;
  emailAuthRequested: boolean;
  emailAuthSent: boolean;
  authCode: string;
  authCodeError: string;
  authCodeValid: boolean | null;
  authTimer: number;
  isUsernameAvailable: boolean | null;
  passwordError: string | null;
  passwordConfirmError: string | null;

  setField: (key: SignupStoreField, value: string) => void;
  setProfileImage: (image: string | null) => void;
  setTerms: (terms: TermsAgreement[]) => void;
  setEmailValid: (valid: boolean | null) => void;
  setEmailError: (error: string) => void;
  setEmailAuthRequested: (requested: boolean) => void;
  setEmailAuthSent: (sent: boolean) => void;
  setAuthCode: (code: string) => void;
  setAuthCodeError: (error: string) => void;
  setAuthCodeValid: (valid: boolean | null) => void;
  setAuthTimer: (timer: number) => void;
  setIsUsernameAvailable: (available: boolean | null) => void;
  setPasswordError: (error: string | null) => void;
  setPasswordConfirmError: (error: string | null) => void;
  reset: () => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
  name: '',
  email: '',
  phoneNumber: '',
  role: '',
  username: '',
  password: '',
  passwordConfirm: '',
  nickname: '',
  gender: '',
  birthDate: '',
  intro: '',
  storeName: '',
  address: '',
  detailAddress: '',
  category: '',
  profileImage: null,
  terms: [...DEFAULT_TERMS],
  emailValid: null,
  emailError: '',
  emailAuthRequested: false,
  emailAuthSent: false,
  authCode: '',
  authCodeError: '',
  authCodeValid: null,
  authTimer: 90,
  isUsernameAvailable: null,
  passwordError: null,
  passwordConfirmError: null,

  setField: (key, value) => set((state) => ({ ...state, [key]: value })),
  setProfileImage: (image) => set({ profileImage: image }),
  setTerms: (terms) => set({ terms }),
  setEmailValid: (valid) => set({ emailValid: valid }),
  setEmailError: (error) => set({ emailError: error }),
  setEmailAuthRequested: (requested) => set({ emailAuthRequested: requested }),
  setEmailAuthSent: (sent) => set({ emailAuthSent: sent }),
  setAuthCode: (code) => set({ authCode: code }),
  setAuthCodeError: (error) => set({ authCodeError: error }),
  setAuthCodeValid: (valid) => set({ authCodeValid: valid }),
  setAuthTimer: (timer) => set({ authTimer: timer }),
  setIsUsernameAvailable: (available) => set({ isUsernameAvailable: available }),
  setPasswordError: (error) => set({ passwordError: error }),
  setPasswordConfirmError: (error) => set({ passwordConfirmError: error }),
  reset: () =>
    set({
      name: '',
      email: '',
      phoneNumber: '',
      role: '',
      username: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      gender: '',
      birthDate: '',
      intro: '',
      storeName: '',
      address: '',
      detailAddress: '',
      category: '',
      profileImage: null,
      terms: [...DEFAULT_TERMS],
      emailValid: null,
      emailError: '',
      emailAuthRequested: false,
      emailAuthSent: false,
      authCode: '',
      authCodeError: '',
      authCodeValid: null,
      authTimer: 90,
      isUsernameAvailable: null,
      passwordError: null,
      passwordConfirmError: null,
    }),
}));
