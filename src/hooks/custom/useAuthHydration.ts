'use client';

import { useSyncExternalStore } from 'react';
import { getAccessToken } from '@/src/stores';

const subscribe = () => () => {};
const getServerSnapshot = () => false;
const getAuthSnapshot = () => !!getAccessToken();
const getHydrationSnapshot = () => true;

export const useAuthHydration = () => {
  const isAuthenticated = useSyncExternalStore(subscribe, getAuthSnapshot, getServerSnapshot);
  const isHydrated = useSyncExternalStore(subscribe, getHydrationSnapshot, getServerSnapshot);

  return { isAuthenticated, isHydrated } as const;
};
