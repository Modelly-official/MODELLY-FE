/**
 * 전체 주소에서 구/동 정보만 추출
 * @param fullAddress "서울시 강남구 청담동 123-45"
 * @returns "강남구 청담동"
 */
export function formatAddress(fullAddress: string): string {
  // 정규식으로 "XX구 XX동" 패턴 추출
  const match = fullAddress.match(/([가-힣]+구)\s+([가-힣]+동)/);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return fullAddress;
}
