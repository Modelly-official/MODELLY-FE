/**
 * 날짜를 한글 형식으로 포맷
 * @param dateStr - "yyyy-MM-dd" 형식의 날짜 문자열 (예: "2025-01-09")
 * @returns "M월 D일" 형식의 날짜 문자열 (예: "1월 9일")
 */
export function formatDateToKorean(dateStr: string): string {
  const date = new Date(dateStr);

  // 유효하지 않은 날짜 처리
  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}월 ${day}일`;
}
