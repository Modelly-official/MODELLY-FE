import { create } from "zustand";

export type SignupStoreField = "name" | "email" | "phoneNumber" | "role";

interface TermsAgreement {
	label: string;
	checked: boolean;
}

interface SignupStore {
	name: string;
	email: string;
	phoneNumber: string;
	role: string;
	terms: TermsAgreement[];
	emailValid: boolean | null;
	emailError: string;
	emailAuthRequested: boolean;
	emailAuthSent: boolean;
	authCode: string;
	authCodeError: string;
	authCodeValid: boolean | null;
	authTimer: number;

	setField: (key: SignupStoreField, value: string) => void;
	setTerms: (terms: TermsAgreement[]) => void;
	setEmailValid: (valid: boolean | null) => void;
	setEmailError: (error: string) => void;
	setEmailAuthRequested: (requested: boolean) => void;
	setEmailAuthSent: (sent: boolean) => void;
	setAuthCode: (code: string) => void;
	setAuthCodeError: (error: string) => void;
	setAuthCodeValid: (valid: boolean | null) => void;
	setAuthTimer: (timer: number) => void;
	reset: () => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
	name: "",
	email: "",
	phoneNumber: "",
	role: "",
	terms: [
		{ label: "[필수] 이용약관 동의", checked: false },
		{ label: "[선택] 개인정보 수집 및 이용 동의", checked: false },
		{ label: "[선택] 광고성 정보 수신 동의", checked: false },
	],
	emailValid: null,
	emailError: "",
	emailAuthRequested: false,
	emailAuthSent: false,
	authCode: "",
	authCodeError: "",
	authCodeValid: null,
	authTimer: 90,

	setField: (key, value) => set((state) => ({ ...state, [key]: value })),
	setTerms: (terms) => set({ terms }),
	setEmailValid: (valid) => set({ emailValid: valid }),
	setEmailError: (error) => set({ emailError: error }),
	setEmailAuthRequested: (requested) => set({ emailAuthRequested: requested }),
	setEmailAuthSent: (sent) => set({ emailAuthSent: sent }),
	setAuthCode: (code) => set({ authCode: code }),
	setAuthCodeError: (error) => set({ authCodeError: error }),
	setAuthCodeValid: (valid) => set({ authCodeValid: valid }),
	setAuthTimer: (timer) => set({ authTimer: timer }),
	reset: () =>
		set({
			name: "",
			email: "",
			phoneNumber: "",
			role: "",
			terms: [
				{ label: "[필수] 이용약관 동의", checked: false },
				{ label: "[선택] 개인정보 수집 및 이용 동의", checked: false },
				{ label: "[선택] 광고성 정보 수신 동의", checked: false },
			],
			emailValid: null,
			emailError: "",
			emailAuthRequested: false,
			emailAuthSent: false,
			authCode: "",
			authCodeError: "",
			authCodeValid: null,
			authTimer: 90,
		}),
}));
