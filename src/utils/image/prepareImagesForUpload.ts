import { fetchImageAsFile } from './fetchImageAsFile';

/**
 * previewUrls와 imageFiles를 받아서 업로드할 File 배열로 변환
 * - https:// URL → fetch하여 File로 변환
 * - blob: URL → imageFiles에서 해당 File 사용
 *
 * @param previewUrls - 미리보기 URL 배열 (기존 https + 새 blob 혼합)
 * @param imageFiles - 새로 추가된 이미지 File 배열 (blob URL과 1:1 매칭)
 * @returns 업로드할 File 배열 (순서 유지)
 */
export async function prepareAllImagesAsFiles(
  previewUrls: string[],
  imageFiles: File[]
): Promise<File[]> {
  const files: File[] = [];
  let blobIndex = 0;

  for (let i = 0; i < previewUrls.length; i++) {
    const url = previewUrls[i];

    if (url.startsWith('blob:')) {
      // 새 이미지 - imageFiles에서 가져오기
      if (blobIndex < imageFiles.length) {
        files.push(imageFiles[blobIndex]);
        blobIndex++;
      }
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      // 기존 이미지 - fetch하여 File로 변환
      const file = await fetchImageAsFile(url, i);
      files.push(file);
    }
  }

  return files;
}

/**
 * previewUrls에 기존 서버 URL이 있는지 확인
 * @param previewUrls - 미리보기 URL 배열
 * @returns 기존 서버 URL 존재 여부
 */
export function hasExistingServerUrls(previewUrls: string[]): boolean {
  return previewUrls.some(
    (url) => url.startsWith('http://') || url.startsWith('https://')
  );
}

/**
 * 이미지 변경 여부 확인
 * - 원본 URL 목록과 현재 previewUrls 비교
 * @param originalUrls - 원본 이미지 URL 목록
 * @param previewUrls - 현재 미리보기 URL 목록
 * @param imageFiles - 새로 추가된 파일 목록
 * @returns 변경 여부
 */
export function hasImageChanges(
  originalUrls: string[],
  previewUrls: string[],
  imageFiles: File[]
): boolean {
  // 새 파일이 있으면 변경됨
  if (imageFiles.length > 0) return true;

  // 개수가 다르면 변경됨
  if (originalUrls.length !== previewUrls.length) return true;

  // URL 목록이 동일한지 확인 (순서 포함)
  const currentServerUrls = previewUrls.filter(
    (url) => url.startsWith('http://') || url.startsWith('https://')
  );

  if (originalUrls.length !== currentServerUrls.length) return true;

  for (let i = 0; i < originalUrls.length; i++) {
    if (originalUrls[i] !== currentServerUrls[i]) return true;
  }

  return false;
}
