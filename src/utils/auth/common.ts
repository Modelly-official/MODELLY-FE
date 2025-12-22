/**
 * 소셜 로그인 타입을 한글 서비스명으로 변환
 */
export const getSocialServiceName = (loginType: string): string => {
  const serviceMap: Record<string, string> = {
    KAKAO: '카카오',
    NAVER: '네이버',
    GOOGLE: '구글',
  };
  return serviceMap[loginType] || loginType;
};

