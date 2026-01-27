import { useQuery } from '@tanstack/react-query';
import {
  getModelHomeReservations,
  getModelHomePopularRecruitments,
  getModelHomeNearbyRecruitments,
  getModelHomePopularDesigners,
} from '@/src/apis/modelHome';
import type { ApiResponse, DesignerListItem, RecruitmentListItem } from '@/src/types';
import type {
  ModelHomeReservationItem,
  ModelHomePopularRecruitmentItem,
  ModelHomePopularRecruitmentsParams,
  ModelHomeNearbyRecruitmentsParams,
  ModelHomePopularDesignersParams,
} from '@/src/types/modelHome';

export const modelHomeKeys = {
  all: ['modelHome'] as const,
  reservations: () => [...modelHomeKeys.all, 'reservations'] as const,
  popularRecruitments: (params: ModelHomePopularRecruitmentsParams) =>
    [...modelHomeKeys.all, 'popularRecruitments', params] as const,
  nearbyRecruitments: (params: ModelHomeNearbyRecruitmentsParams) =>
    [...modelHomeKeys.all, 'nearbyRecruitments', params] as const,
  popularDesigners: (params: ModelHomePopularDesignersParams) =>
    [...modelHomeKeys.all, 'popularDesigners', params] as const,
};

interface QueryOptions {
  enabled?: boolean;
}

export function useModelHomeReservations(options: QueryOptions = {}) {
  const { enabled = true } = options;

  return useQuery<ApiResponse<ModelHomeReservationItem[]>, Error>({
    queryKey: modelHomeKeys.reservations(),
    queryFn: getModelHomeReservations,
    enabled,
    staleTime: 1000 * 60, // 1분
  });
}

export function useModelHomePopularRecruitments(
  params: ModelHomePopularRecruitmentsParams = {},
  options: QueryOptions = {},
) {
  const { enabled = true } = options;

  return useQuery<ApiResponse<ModelHomePopularRecruitmentItem[]>, Error>({
    queryKey: modelHomeKeys.popularRecruitments(params),
    queryFn: () => getModelHomePopularRecruitments(params),
    enabled,
    staleTime: 1000 * 60, // 1분
  });
}

export function useModelHomeNearbyRecruitments(params: ModelHomeNearbyRecruitmentsParams, options: QueryOptions = {}) {
  const { enabled = true } = options;

  const hasLocation = params.userLatitude !== undefined && params.userLongitude !== undefined;

  return useQuery<ApiResponse<RecruitmentListItem[]>, Error>({
    queryKey: modelHomeKeys.nearbyRecruitments(params),
    queryFn: () => getModelHomeNearbyRecruitments(params),
    enabled: enabled && hasLocation,
    staleTime: 1000 * 60, // 1분
  });
}

export function useModelHomePopularDesigners(params: ModelHomePopularDesignersParams, options: QueryOptions = {}) {
  const { enabled = true } = options;

  const hasLocation = params.userLatitude !== undefined && params.userLongitude !== undefined;

  return useQuery<ApiResponse<DesignerListItem[]>, Error>({
    queryKey: modelHomeKeys.popularDesigners(params),
    queryFn: () => getModelHomePopularDesigners(params),
    enabled: enabled && hasLocation,
    staleTime: 1000 * 60, // 1분
  });
}
