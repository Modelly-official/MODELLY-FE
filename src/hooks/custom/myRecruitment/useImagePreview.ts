import { useEffect, useMemo } from 'react';

interface UseImagePreviewOptions {
  /** 새로 추가된 이미지 파일들 */
  imageFiles: File[];
  /** 기존 미리보기 URL들 (수정 모드에서 서버 URL 포함) */
  existingUrls: string[];
  /** URL 변경 시 호출되는 콜백 */
  onUrlsChange: (urls: string[]) => void;
}

/**
 * 이미지 파일의 미리보기 URL을 관리하는 hook
 * - File[] -> blob URL 자동 변환
 * - 언마운트/파일 변경 시 blob URL 자동 cleanup (메모리 누수 방지)
 * - 외부 URL (서버 URL)은 보존
 */
export function useImagePreview({ imageFiles, existingUrls, onUrlsChange }: UseImagePreviewOptions): void {
  // 각 파일의 고유 키를 생성하여 파일 변경 감지
  const imageFilesKey = useMemo(
    () => imageFiles.map((f) => `${f.name}-${f.size}-${f.lastModified}`).join(','),
    [imageFiles],
  );

  useEffect(() => {
    // 새 파일이 없으면 기존 URL 유지 (수정 모드에서 기존 이미지 유지)
    if (imageFiles.length === 0) {
      return;
    }

    // 이전 blob URL들만 revoke (외부 URL은 제외)
    existingUrls.forEach((url) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });

    // 기존 서버 URL 유지 + 새 blob URL 추가
    const serverUrls = existingUrls.filter((url) => !url.startsWith('blob:'));
    const newBlobUrls = imageFiles.map((file) => URL.createObjectURL(file));
    onUrlsChange([...serverUrls, ...newBlobUrls]);

    // cleanup: 컴포넌트 언마운트 시 URL revoke
    return () => {
      newBlobUrls.forEach((url) => URL.revokeObjectURL(url));
    };
    // imageFilesKey를 의존성으로 사용하여 파일 교체도 감지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFilesKey]);
}
