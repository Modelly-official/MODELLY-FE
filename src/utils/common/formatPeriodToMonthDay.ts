/**
 * 기간 문자열을 월.일~월.일 형식으로 포맷
 * @param period - "yyyy-MM-dd ~ yyyy-MM-dd" 형식의 기간 문자열 (예: "2026-01-03 ~ 2026-01-17")
 * @returns "M.D~M.D" 형식의 기간 문자열 (예: "1.3~1.17")
 */
export function formatPeriodToMonthDay(period: string | undefined): string {
  if (!period) return '';

  const match = period.match(/(\d{4})-(\d{2})-(\d{2})\s*~\s*(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return period;

  const [, , startMonth, startDay, , endMonth, endDay] = match;
  const formatPart = (m: string, d: string) => `${parseInt(m, 10)}.${parseInt(d, 10)}`;

  return `${formatPart(startMonth, startDay)}~${formatPart(endMonth, endDay)}`;
}
