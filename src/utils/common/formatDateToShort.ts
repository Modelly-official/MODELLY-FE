/**
 * 날짜를 YY.MM.DD 형식으로 포맷
 * @param dateStr - "yyyy-MM-dd" 형식의 날짜 문자열 (예: "2025-10-31")
 * @returns "YY.MM.DD" 형식의 날짜 문자열 (예: "25.10.31")
 */
export function formatDateToShort(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');

  // 유효하지 않은 입력 처리
  if (!year || !month || !day) {
    return dateStr;
  }

  return `${year.slice(2)}.${month}.${day}`;
}
