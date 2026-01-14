// ===== 지도 기본 설정 =====
export const MAP_DEFAULTS = {
  /** 서울 홍대입구역 기본 좌표 */
  CENTER: {
    lat: 37.5571,
    lng: 126.9236,
  },
  /** 기본 줌 레벨 */
  ZOOM: 15,
} as const;

// ===== 레이아웃 상수 =====
export const LAYOUT = {
  /** BottomNav 높이 (px) - safe-area 포함 */
  BOTTOM_NAV_HEIGHT: 76,
  /** SelectedShopCard 예상 높이 (px) */
  SELECTED_CARD_HEIGHT: 340,
} as const;

// ===== BottomSheet 높이 설정 (vh 기준) =====
export const SHEET_HEIGHTS = {
  /** 최소 높이 (핸들 + 타이틀 + 탭) */
  min: 8,
  /** 중간 높이 */
  mid: 50,
  /** 최대 높이 (BottomNav 영역 제외) */
  max: 85,
} as const;

// ===== 드래그 관련 상수 =====
export const DRAG = {
  /** 드래그 임계값 (px) - BottomSheet 상태 전환용 */
  THRESHOLD: 50,
  /** SelectedShopCard 콘텐츠 높이 (px) */
  CARD_CONTENT_HEIGHT: 230,
  /** SelectedShopCard 접힘 임계값 (px) */
  COLLAPSE_THRESHOLD: 100,
} as const;

// ===== 타입 export =====
export type SheetState = keyof typeof SHEET_HEIGHTS;
