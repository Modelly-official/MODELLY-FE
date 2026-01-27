import type { Category } from '../recruitment';

export type HomeCategory = 'ALL' | 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH';

export type ReservationSummary = {
  id: number;
  designerName: string;
  shop: string;
  recruitmentTitle: string;
  date: string;
  time: string;
  dday: string;
  tags: string[];
};

export interface ModelHomeReservationItem {
  reservationId: number;
  designerNickname: string;
  shop: string;
  recruitmentTitle: string;
  category: Category;
  subCategories: string[];
  startDateTime: string;
  dDay: number;
}

export interface ModelHomePopularRecruitmentItem {
  recruitmentId: number;
  designerNickname: string;
  shop: string;
  recruitmentTitle: string;
  thumbnailUrl?: string;
  category: Category;
  subCategories: string[];
}

export interface ModelHomePopularRecruitmentsParams {
  category?: Category;
}

export interface ModelHomeNearbyRecruitmentsParams {
  category?: Category;
  userLatitude: number;
  userLongitude: number;
}

export interface ModelHomePopularDesignersParams {
  category?: Category;
  userLatitude: number;
  userLongitude: number;
}
