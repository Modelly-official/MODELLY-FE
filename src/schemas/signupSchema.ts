import { z } from "zod";

// 아이디 (소문자 영어, 숫자만 허용)
export const usernameSchema = z
  .string()
  .min(1, "아이디를 입력해주세요");

// 비밀번호 (영문, 숫자, 특수문자 조합 8자 이상)
export const passwordSchema = z
  .string()
  .min(8, "영문 대소문자, 숫자, 특수문자(~!@#^*) 조합 8자 이상이어야 합니다.")
  .regex(/[a-zA-Z]/, "영문 대소문자, 숫자, 특수문자(~!@#^*) 조합 8자 이상이어야 합니다.")
  .regex(/\d/, "영문 대소문자, 숫자, 특수문자(~!@#^*) 조합 8자 이상이어야 합니다.")
  .regex(/[~!@#^*]/, "영문 대소문자, 숫자, 특수문자(~!@#^*) 조합 8자 이상이어야 합니다.");

// 비밀번호 확인 스키마 (비밀번호와 일치 여부 검증)
export const createPasswordConfirmSchema = (password: string) =>
  z.string().refine((val) => val === password, {
    message: "비밀번호가 일치하지 않습니다.",
  });

// 이메일
export const emailSchema = z
  .string()
  .email("올바른 이메일 형식이 아닙니다");

// 전화번호 (010-1234-5678 형식)
export const phoneNumberSchema = z
  .string()
  .regex(/^010-\d{4}-\d{4}$/, "올바른 전화번호 형식이 아닙니다 (010-1234-5678)");

// 이름
export const nameSchema = z
  .string()
  .min(1, "이름을 입력해주세요");

// 로그인 정보 전체
export const loginInfoSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["passwordConfirm"],
});

// 기본 정보 전체
export const basicInfoSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
});
