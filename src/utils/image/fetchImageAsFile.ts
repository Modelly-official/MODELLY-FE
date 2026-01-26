/**
 * URL에서 이미지를 fetch하여 File 객체로 변환
 * - S3 이미지 URL을 다운로드하여 File로 변환
 * - 수정 모드에서 기존 이미지를 재업로드하기 위해 사용
 */

/**
 * 단일 URL을 File로 변환
 * @param url - 이미지 URL (https://)
 * @param index - 파일명에 사용할 인덱스
 * @returns File 객체
 */
export async function fetchImageAsFile(url: string, index: number): Promise<File> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`이미지 다운로드 실패: ${response.status}`);
  }

  const blob = await response.blob();

  // Content-Type에서 확장자 추출
  const contentType = blob.type || 'image/jpeg';
  const extension = contentType.split('/')[1] || 'jpg';

  // 파일명 생성
  const filename = `image_${index + 1}.${extension}`;

  return new File([blob], filename, { type: contentType });
}

/**
 * 여러 URL을 병렬로 File로 변환
 * @param urls - 이미지 URL 배열
 * @returns File 배열
 */
export async function fetchImagesAsFiles(urls: string[]): Promise<File[]> {
  const results = await Promise.all(
    urls.map((url, index) => fetchImageAsFile(url, index))
  );
  return results;
}
