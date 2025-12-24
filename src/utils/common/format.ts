/**
 * 전체 주소에서 구/동 정보만 추출
 * @param fullAddress "서울시 강남구 청담동 123-45"
 * @returns "강남구 청담동"
 */
export function formatAddress(fullAddress: string): string {
  // 정규식으로 "XX구 XX동" 패턴 추출
  const match = fullAddress.match(/([가-힣]+[구군])\s*([가-힣]+[동읍면리])/);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return fullAddress;
}

/**
 * 거리를 포맷팅 (미터 단위로 표시)
 * @param distanceInMeters 거리 (미터 단위)
 * @returns "440m" 또는 "1.2km"
 */
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters >= 1000) {
    return `${(distanceInMeters / 1000).toFixed(1)}km`;
  }
  return `${Math.round(distanceInMeters)}m`;
}
