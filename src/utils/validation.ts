import { z } from "zod";

// Zod 스키마 검증 결과를 "success" | "error" | null로 변환
export function validateField<T>(schema: z.Schema<T>, value: T): "success" | "error" | null {
  if (!value) return null;
  const result = schema.safeParse(value);
  return result.success ? "success" : "error";
}

// 영어 소문자와 숫자만 허용하는 필터
export function filterAlphanumeric(value: string): string {
  return value.replace(/[^a-z0-9]/g, "");
}

// 두 값이 일치하는지 검증
export function validateMatch(value1: string, value2: string): "success" | "error" | null {
  if (!value2) return null;
  return value1 === value2 ? "success" : "error";
}

// 생년월일 포맷팅 (YYYY.MM.DD)
export function formatBirthDate(value: string): string {
  const numbers = value.replace(/[^\d]/g, "");
  const limited = numbers.slice(0, 8);
  
  if (limited.length <= 4) {
    return limited;
  }
  if (limited.length <= 6) {
    return `${limited.slice(0, 4)}.${limited.slice(4)}`;
  }
  return `${limited.slice(0, 4)}.${limited.slice(4, 6)}.${limited.slice(6)}`;
}

// 이미지 파일을 base64로 변환
export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert image"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 전화번호 유효성 검증 (최소 10자리)
export function validatePhoneNumber(phoneNumber: string): boolean {
  return phoneNumber.length >= 10;
}

// 인증번호 검증 (API 연동 전 임시 로직)
export function verifyAuthCode(authCode: string, expectedCode: string = "1234"): boolean {
  return authCode === expectedCode;
}
