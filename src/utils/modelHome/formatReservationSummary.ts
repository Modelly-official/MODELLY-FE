import { formatDateToKorean, formatTimeWithPeriod } from '@/src/utils/common';
import type { ModelReservationItem } from '@/src/types';
import type { ReservationSummary, ModelHomeReservationItem } from '@/src/types/modelHome';

export function getDdayLabel(dateStr: string) {
  const target = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'D-day';
  return `D-${diffDays}`;
}

function getDdayLabelFromNumber(dDay: number) {
  if (dDay === 0) return 'D-day';
  if (dDay > 0) return `D-${dDay}`;
  return `D+${Math.abs(dDay)}`;
}

function parseStartDateTime(value: string) {
  const isoMatch = value.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})/);
  if (isoMatch) {
    const [, year, month, day, hour, minute] = isoMatch;
    return {
      date: `${year}-${month}-${day}`,
      time: `${hour.padStart(2, '0')}:${minute}`,
      isKoreanDate: false,
    };
  }

  const koreanMatch = value.match(/(\d{1,2})월\s*(\d{1,2})일\s*(\d{1,2}):(\d{2})/);
  if (koreanMatch) {
    const [, month, day, hour, minute] = koreanMatch;
    return {
      date: `${Number(month)}월 ${Number(day)}일`,
      time: `${hour.padStart(2, '0')}:${minute}`,
      isKoreanDate: true,
    };
  }

  return {
    date: value,
    time: '00:00',
    isKoreanDate: false,
  };
}

function getDateTimeParts(item: ModelReservationItem | ModelHomeReservationItem) {
  if ('startDateTime' in item) {
    const parsed = parseStartDateTime(item.startDateTime);
    return {
      date: parsed.date,
      time: parsed.time,
      dday: getDdayLabelFromNumber(item.dDay),
      isKoreanDate: parsed.isKoreanDate,
    };
  }

  return {
    date: item.date,
    time: item.startTime,
    dday: getDdayLabel(item.date),
    isKoreanDate: false,
  };
}

export function buildReservationSummary(
  item: ModelReservationItem | ModelHomeReservationItem,
): ReservationSummary {
  const { date, time, dday, isKoreanDate } = getDateTimeParts(item);

  return {
    id: item.reservationId,
    designerName: item.designerNickname,
    shop: item.shop,
    recruitmentTitle: item.recruitmentTitle,
    date: isKoreanDate ? date : formatDateToKorean(date),
    time: formatTimeWithPeriod(time).replace(' ', ''),
    dday,
    tags: [item.category, ...item.subCategories],
  };
}
