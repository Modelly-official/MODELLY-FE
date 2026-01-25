/**
 * 시간을 한글 형식으로 포맷
 * @param timeStr - "HH:mm" 형식의 시간 문자열 (예: "09:00", "14:30")
 * @returns "오전/오후 H시" 또는 "오전/오후 H시 M분" 형식의 시간 문자열 (예: "오전 9시", "오후 2시 30분")
 */
export function formatTimeToKorean(timeStr: string): string {
  const [hour, minute] = timeStr.split(':');
  const hourNum = parseInt(hour, 10);
  const minuteNum = parseInt(minute, 10);

  // 유효하지 않은 입력 처리
  if (Number.isNaN(hourNum)) {
    return timeStr;
  }

  const period = hourNum < 12 ? '오전' : '오후';
  const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;

  // 분이 0이 아닐 때만 분 표시
  if (minuteNum > 0) {
    return `${period} ${displayHour}시 ${minuteNum}분`;
  }

  return `${period} ${displayHour}시`;
}
