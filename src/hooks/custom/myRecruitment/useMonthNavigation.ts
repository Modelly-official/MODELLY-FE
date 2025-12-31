import { useState, useMemo, useCallback } from 'react';

interface UseMonthNavigationOptions {
  /** 초기 날짜 (기본값: 현재 날짜) */
  initialDate?: Date;
}

interface UseMonthNavigationReturn {
  /** 현재 Date 객체 */
  currentDate: Date;
  /** 연도 (4자리) */
  year: number;
  /** 월 (1-12) */
  month: number;
  /** API 호출용 월 문자열 (YYYY-MM 형식) */
  monthString: string;
  /** 이전 달로 이동 */
  handlePrevMonth: () => void;
  /** 다음 달로 이동 */
  handleNextMonth: () => void;
}

/**
 * 월 네비게이션 상태를 관리하는 hook
 * - 년/월 상태 관리
 * - 이전/다음 달 이동
 * - API 호출용 월 문자열 자동 생성
 */
export function useMonthNavigation(options?: UseMonthNavigationOptions): UseMonthNavigationReturn {
  const [currentDate, setCurrentDate] = useState(() => options?.initialDate ?? new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const monthString = useMemo(() => {
    return `${year}-${month.toString().padStart(2, '0')}`;
  }, [year, month]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }, []);

  return {
    currentDate,
    year,
    month,
    monthString,
    handlePrevMonth,
    handleNextMonth,
  };
}
