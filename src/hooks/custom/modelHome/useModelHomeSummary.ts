'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { useModelHomeReservations } from '@/src/hooks/queries/modelHome';
import { useModelProfile } from '@/src/hooks/queries/mypage';
import { getAccessToken } from '@/src/stores';
import type { ReservationSummary, ModelHomeReservationItem } from '@/src/types/modelHome';
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

  const reservationsQuery = useModelHomeReservations({ enabled: isLoggedIn });
  const reservationItems = useMemo<ModelHomeReservationItem[]>(() => {
    return reservationsQuery.data?.result ?? [];
  }, [reservationsQuery.data?.result]);

  const upcomingReservations = useMemo(() => {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const getTimeMinutes = (value: string) => {
      const match = value.match(/(\d{1,2}):(\d{2})/);
      if (!match) return null;
      return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    };

    return reservationItems.filter((item) => {
      if (item.dDay > 0) return true;
      if (item.dDay < 0) return false;

      const reservationMinutes = getTimeMinutes(item.startDateTime);
      if (reservationMinutes === null) return true;
      return reservationMinutes >= nowMinutes;
    });
  }, [reservationItems]);

  const confirmedReservation = useMemo(() => {
    if (upcomingReservations.length === 0) return null;

    const getTimeMinutes = (value: string) => {
      const match = value.match(/(\d{1,2}):(\d{2})/);
      if (!match) return 0;
      return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    };

    return [...upcomingReservations].sort((a, b) => {
      if (a.dDay !== b.dDay) return a.dDay - b.dDay;
      return getTimeMinutes(a.startDateTime) - getTimeMinutes(b.startDateTime);
    })[0];
  }, [upcomingReservations]);

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
