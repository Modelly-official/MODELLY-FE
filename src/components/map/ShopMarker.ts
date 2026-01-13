// 샵 마커 생성 유틸리티
import type { Category } from '@/src/types/recruitment';
import type { MapShopItem } from '@/src/types/map';

// 마커 색상 (단일 색상)
const MARKER_COLOR = '#8F93FF'; // Blue/Purple 50

// 카테고리별 아이콘 경로
const MARKER_ICON_PATHS: Record<Category, string> = {
  HAIR: '/icons/map/marker-hair.svg',
  NAIL: '/icons/map/marker-nail.svg',
  TATTOO: '/icons/map/marker-tatoo.svg',
  EYELASH: '/icons/map/marker-eyelash.svg',
};

// 마커 크기 (Figma 기준)
const MARKER_WIDTH = 38;
const MARKER_HEIGHT = 44;
const ICON_CIRCLE_SIZE = 28;
const ICON_SIZE = 18;

// 마커 배경 경로
const MARKER_UNION_PATH = '/icons/map/marker-union.svg';

// HTML 마커 생성
function createMarkerHtml(category: Category): string {
  const iconPath = MARKER_ICON_PATHS[category];

  return `
    <div style="
      position: relative;
      width: ${MARKER_WIDTH}px;
      height: ${MARKER_HEIGHT}px;
      cursor: pointer;
    ">
      <img
        src="${MARKER_UNION_PATH}"
        width="${MARKER_WIDTH}"
        height="${MARKER_HEIGHT}"
        alt=""
        style="position: absolute; top: 0; left: 0;"
      />
      <div style="
        position: absolute;
        top: 5px;
        left: 5px;
        width: ${ICON_CIRCLE_SIZE}px;
        height: ${ICON_CIRCLE_SIZE}px;
        background-color: ${MARKER_COLOR};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <img
          src="${iconPath}"
          width="${ICON_SIZE}"
          height="${ICON_SIZE}"
          alt=""
          style="display: block;"
        />
      </div>
    </div>
  `;
}

export interface ShopMarkerOptions {
  shop: MapShopItem;
  map: naver.maps.Map;
  onClick?: (shop: MapShopItem) => void;
}

// 샵 마커 생성
export function createShopMarker({
  shop,
  map,
  onClick,
}: ShopMarkerOptions): naver.maps.Marker {
  const position = new naver.maps.LatLng(shop.shopLatitude, shop.shopLongitude);

  const marker = new naver.maps.Marker({
    position,
    map,
    icon: {
      content: createMarkerHtml(shop.category),
      size: new naver.maps.Size(MARKER_WIDTH, MARKER_HEIGHT),
      anchor: new naver.maps.Point(MARKER_WIDTH / 2, MARKER_HEIGHT),
    },
  });

  if (onClick) {
    naver.maps.Event.addListener(marker, 'click', () => {
      onClick(shop);
    });
  }

  return marker;
}

// 여러 마커 생성
export function createShopMarkers(
  shops: MapShopItem[],
  map: naver.maps.Map,
  onClick?: (shop: MapShopItem) => void
): naver.maps.Marker[] {
  return shops.map((shop) => createShopMarker({ shop, map, onClick }));
}

// 클러스터링용 마커 생성 (map에 추가하지 않음)
export function createShopMarkersForClustering(
  shops: MapShopItem[],
  onClick?: (shop: MapShopItem) => void
): naver.maps.Marker[] {
  return shops.map((shop) => {
    const position = new naver.maps.LatLng(shop.shopLatitude, shop.shopLongitude);

    const marker = new naver.maps.Marker({
      position,
      icon: {
        content: createMarkerHtml(shop.category),
        size: new naver.maps.Size(MARKER_WIDTH, MARKER_HEIGHT),
        anchor: new naver.maps.Point(MARKER_WIDTH / 2, MARKER_HEIGHT),
      },
    });

    if (onClick) {
      naver.maps.Event.addListener(marker, 'click', () => {
        onClick(shop);
      });
    }

    return marker;
  });
}

// 마커 제거
export function removeMarkers(markers: naver.maps.Marker[]): void {
  markers.forEach((marker) => {
    marker.setMap(null);
  });
}

// 마커 색상 export
export { MARKER_COLOR };
