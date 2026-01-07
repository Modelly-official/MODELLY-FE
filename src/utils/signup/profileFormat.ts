// 포맷팅 관련 유틸리티

// 생년월일 포맷팅 (YYYY.MM.DD) - 화면 상 입력용
export function formatBirthDate(value: string): string {
  const numbers = value.replace(/[^\d]/g, '');
  const limited = numbers.slice(0, 8);

  if (limited.length <= 4) {
    return limited;
  }
  if (limited.length <= 6) {
    return `${limited.slice(0, 4)}.${limited.slice(4)}`;
  }
  return `${limited.slice(0, 4)}.${limited.slice(4, 6)}.${limited.slice(6)}`;
}

// 아이디 포맷팅 (영어 소문자와 숫자만 허용)
export function formatLoginId(value: string): string {
  return value.replace(/[^a-z0-9]/g, '');
}

// 주소 포맷팅 (시군구와 상세주소로 분리)
export function formatAddressLines(
  fullAddress: string,
  detailAddress: string = '',
): { addressLine1: string; addressLine2: string } {
  // "서울 마포구 와우산로 94 (상수동, 홍익대학교)" 형태
  const parts = fullAddress.trim().split(' ');

  // 시도 + 시군구 (처음 2개)
  const cityPart = parts.slice(0, 2).join(' '); // "서울 마포구"
  const streetPart = parts.slice(2).join(' '); // "와우산로 94 (상수동, 홍익대학교)"

  // addressLine2 = 나머지 주소 + 상세주소
  const line2Parts = [streetPart, detailAddress].filter(Boolean); //"와우산로 94 (상수동, 홍익대학교) 503호"

  return {
    addressLine1: cityPart,
    addressLine2: line2Parts.join(' '),
  };
}

// DB 성별 값을 화면용 텍스트로 변환 (남성, 여성 -> 남자, 여자)
export function convertGenderToDisplay(value?: string): '남자' | '여자' | '' {
  const normalized = value?.trim().toUpperCase();
  if (normalized === 'MALE' || normalized === '남자' || normalized === '남성') return '남자';
  if (normalized === 'FEMALE' || normalized === '여자' || normalized === '여성') return '여자';
  return '';
}
