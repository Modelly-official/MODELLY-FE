// 지도(Map) 페이지 관련 타입 정의

import type { Category, SubCategory, SortOption } from '../recruitment';

// ===== API 원본 응답 (한글 category) =====
export interface MapShopApiItem {
  designerId: number;
  shopName: string;
  category: string; // API 응답은 한글 ("헤어", "네일" 등)
  shopLatitude: number;
  shopLongitude: number;
}

// ===== 지도 샵 아이템 (마커용, 변환 후) =====
export interface MapShopItem {
  designerId: number;
  shopName: string;
  category: Category; // 영문 enum으로 변환됨
  shopLatitude: number;
  shopLongitude: number;
}

// ===== 지도 샵 조회 파라미터 =====
export interface MapShopParams {
  size?: number;
  category?: Category;
  userLatitude: number;
  userLongitude: number;
}

// ===== 지도 샵 API 원본 응답 =====
export interface MapShopApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MapShopApiItem[];
}

// ===== 지도 샵 조회 응답 (변환 후) =====
export interface MapShopResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MapShopItem[];
}

// ===== 지도 상태 =====
export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapState {
  center: MapPosition;
  zoom: number;
}

// ===== BottomSheet 상태 =====
export type BottomSheetState = 'min' | 'mid' | 'max';

// ===== BottomSheet 높이 설정 =====
export interface BottomSheetHeights {
  min: number;
  mid: number;
  max: number;
}

// ===== 선택된 샵 정보 (상세 카드용) =====
export interface SelectedShopInfo {
  designerId: number;
  shopName: string;
  category: Category;
  position: MapPosition;
}

// ===== BottomSheet 필터 상태 =====
export interface MapFilterState {
  category: Category | null;
  subCategory: SubCategory | null;
  sortOption: SortOption;
}

// ===== 마커 클러스터 =====
export interface MarkerClusterData {
  position: MapPosition;
  count: number;
  markers: MapShopItem[];
}
