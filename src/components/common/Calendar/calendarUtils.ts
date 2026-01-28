export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/** 해당 월의 날짜 배열 생성 (빈 칸 포함) */
export const generateCalendarDays = (year: number, month: number): (number | null)[] => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) days.push(null);
  for (let day = 1; day <= daysInMonth; day++) days.push(day);

  return days;
};

/** 날짜 문자열 생성 (YYYY-MM-DD) */
export const formatDateString = (year: number, month: number, day: number): string => {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/** 오늘 날짜 문자열 반환 */
export const getTodayString = (): string => {
  const now = new Date();
  return formatDateString(now.getFullYear(), now.getMonth() + 1, now.getDate());
};

/** 현재 시간 문자열 반환 (HH:mm) */
export const getCurrentTimeString = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

/** 특정 날짜가 오늘인지 확인 */
export const isToday = (date: string): boolean => {
  return date === getTodayString();
};
