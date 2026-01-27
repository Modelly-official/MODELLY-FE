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

  const confirmedReservation = useMemo(() => {
    if (reservationItems.length === 0) return null;

    return [...reservationItems].sort((a, b) => {
      const aTime = new Date(a.startDateTime).getTime();
      const bTime = new Date(b.startDateTime).getTime();
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
