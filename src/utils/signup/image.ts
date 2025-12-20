// 이미지 처리 유틸리티

// 이미지 파일을 base64로 변환
export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('이미지 변환 실패'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
