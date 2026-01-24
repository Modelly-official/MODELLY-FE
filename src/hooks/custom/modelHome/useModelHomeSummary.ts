'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { useModelReservations } from '@/src/hooks/queries/reservation';
import { useModelProfile } from '@/src/hooks/queries/mypage';
import { getAccessToken } from '@/src/stores';
import type { ModelReservationItem } from '@/src/types';
import type { ReservationSummary } from '@/src/types/modelHome';
import { buildReservationSummary } from '@/src/utils/modelHome/formatReservationSummary';

const emptySubscribe = () => () => {};

export function useModelHomeSummary() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isLoggedIn = isClient && !!getAccessToken();

  const { data: profileData, isLoading: isProfileLoading } = useModelProfile(isLoggedIn);
  const profile = profileData?.result ?? null;

  const reservationsQuery = useModelReservations('UPCOMING', {}, { enabled: isLoggedIn });
  const reservationItems = useMemo<ModelReservationItem[]>(() => {
    return reservationsQuery.data?.pages.flatMap((page) => page.result.items) ?? [];
  }, [reservationsQuery.data?.pages]);

  const confirmedReservation = useMemo(() => {
    const confirmedItems = reservationItems.filter((item) => item.status === 'RESERVATION_CONFIRMED');
    if (confirmedItems.length === 0) return null;

    return [...confirmedItems].sort((a, b) => {
      const aTime = new Date(`${a.date}T${a.startTime}:00`).getTime();
      const bTime = new Date(`${b.date}T${b.startTime}:00`).getTime();
      return aTime - bTime;
    })[0];
  }, [reservationItems]);

  const reservationSummary = useMemo<ReservationSummary | null>(() => {
    if (!confirmedReservation) return null;
    return buildReservationSummary(confirmedReservation);
  }, [confirmedReservation]);

  const isReservationLoading = isLoggedIn && (reservationsQuery.isLoading || !reservationsQuery.data);

  return {
    authReady: isClient,
    isLoggedIn,
    isSummaryLoading: isLoggedIn && (isProfileLoading || isReservationLoading),
    modelName: profile?.nickname ?? '모델',
    profileImageUrl: profile?.profileImageUrl ?? null,
    reservationSummary,
    hasReservation: Boolean(reservationSummary),
  };
}
