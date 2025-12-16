import { z } from "zod";

// Zod 스키마 검증 결과를 "success" | "error" | null로 변환
export function validateField<T>(schema: z.Schema<T>, value: T): "success" | "error" | null {
  if (!value) return null;
  const result = schema.safeParse(value);
  return result.success ? "success" : "error";
}

// 비밀번호 확인 - 두 값이 일치하는지 검증
export function validateMatch(value1: string, value2: string): "success" | "error" | null {
  if (!value2) return null;
  return value1 === value2 ? "success" : "error";
}

// 전화번호 형식 - 유효성 검증
export function validatePhoneNumber(phoneNumber: string): boolean {
  const numbers = phoneNumber.replace(/-/g, '');
  return numbers.length >= 10;
}
