import { formatDateToKorean, formatTimeWithPeriod } from '@/src/utils/common';
import type { ModelReservationItem } from '@/src/types';
import type { ReservationSummary } from '@/src/types/modelHome';

export function getDdayLabel(dateStr: string) {
  const target = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'D-day';
  return `D-${diffDays}`;
}

export function buildReservationSummary(item: ModelReservationItem): ReservationSummary {
  return {
    id: item.reservationId,
    designerName: item.designerNickname,
    shop: item.shop,
    recruitmentTitle: item.recruitmentTitle,
    date: formatDateToKorean(item.date),
    time: formatTimeWithPeriod(item.startTime).replace(' ', ''),
    dday: getDdayLabel(item.date),
    tags: [item.category, ...item.subCategories],
  };
}
