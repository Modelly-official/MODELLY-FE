/**
 * 24시간 형식의 시간에 am/pm 표시 추가
 * @param timeStr - "HH:mm" 형식의 시간 문자열 (예: "14:00", "09:30")
 * @returns "HH:mm am/pm" 형식의 시간 문자열 (예: "14:00 pm", "09:30 am")
 */
export function formatTimeWithPeriod(timeStr: string): string {
  const [hour] = timeStr.split(':');
  const hourNum = parseInt(hour, 10);

  // 유효하지 않은 입력 처리
  if (Number.isNaN(hourNum)) {
    return timeStr;
  }

  const period = hourNum >= 12 ? 'pm' : 'am';

  return `${timeStr} ${period}`;
}
