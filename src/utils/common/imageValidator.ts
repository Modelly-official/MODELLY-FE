// 허용된 이미지 MIME 타입
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// 최대 파일 크기 (5MB)
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// 파일 크기 포맷 (에러 메시지용)
export const MAX_IMAGE_SIZE_TEXT = '5MB';

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 단일 이미지 파일 유효성 검사
 * - MIME 타입 검증
 * - 파일 크기 검증
 */
export function validateImageFile(file: File): ImageValidationResult {
  // MIME 타입 검증
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `${file.name}: 지원하지 않는 이미지 형식입니다 (JPEG, PNG, GIF, WebP만 가능)`,
    };
  }

  // 파일 크기 검증
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      isValid: false,
      error: `${file.name}: 파일 크기가 ${MAX_IMAGE_SIZE_TEXT}를 초과합니다`,
    };
  }

  return { isValid: true };
}

/**
 * 여러 이미지 파일 유효성 검사
 * 유효한 파일과 에러 목록을 분리하여 반환
 */
export function validateImageFiles(files: File[]): {
  validFiles: File[];
  errors: string[];
} {
  const validFiles: File[] = [];
  const errors: string[] = [];

  files.forEach((file) => {
    const result = validateImageFile(file);
    if (result.isValid) {
      validFiles.push(file);
    } else if (result.error) {
      errors.push(result.error);
    }
  });

  return { validFiles, errors };
}
