/**
 * 현재 위치 마커 생성 함수
 * - 외곽: 연한 보라색 반투명 원 (위치 정확도 영역)
 * - 중앙: 흰색 배경 + 보라색 내부 원 (현재 위치 포인트)
 * - 펄스 애니메이션 효과 포함
 */

// 정확도 원 크기 (px)
const ACCURACY_CIRCLE_SIZE = 80;
// 위치 포인트 크기 (px)
const LOCATION_DOT_SIZE = 24;
// 내부 원 크기 (px)
const INNER_DOT_SIZE = 16;
// 내부 원 색상 (진한 보라색)
const INNER_DOT_COLOR = '#6366F1';

/**
 * 현재 위치 마커 HTML 생성
 */
function createCurrentLocationMarkerHtml(): string {
  return `
    <div style="
      position: relative;
      width: ${ACCURACY_CIRCLE_SIZE}px;
      height: ${ACCURACY_CIRCLE_SIZE}px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <!-- 정확도 원 (반투명 보라색) -->
      <div class="current-location-accuracy" style="
        position: absolute;
        width: ${ACCURACY_CIRCLE_SIZE}px;
        height: ${ACCURACY_CIRCLE_SIZE}px;
        border-radius: 50%;
        background-color: rgba(122, 125, 255, 0.15);
        border: 1px solid rgba(122, 125, 255, 0.3);
      "></div>

      <!-- 중앙 위치 포인트 -->
      <div style="
        position: relative;
        width: ${LOCATION_DOT_SIZE}px;
        height: ${LOCATION_DOT_SIZE}px;
        border-radius: 50%;
        background-color: white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
      ">
        <!-- 내부 보라색 원 (펄스 애니메이션) -->
        <div class="current-location-pulse" style="
          width: ${INNER_DOT_SIZE}px;
          height: ${INNER_DOT_SIZE}px;
          border-radius: 50%;
          background-color: ${INNER_DOT_COLOR};
        "></div>
      </div>
    </div>
  `;
}

/**
 * 현재 위치 마커 생성
 */
export function createCurrentLocationMarker(
  position: { lat: number; lng: number }
): naver.maps.Marker {
  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(position.lat, position.lng),
    icon: {
      content: createCurrentLocationMarkerHtml(),
      anchor: new naver.maps.Point(ACCURACY_CIRCLE_SIZE / 2, ACCURACY_CIRCLE_SIZE / 2),
    },
    zIndex: 100, // 다른 마커보다 위에 표시
  });

  return marker;
}

/**
 * 현재 위치 마커 위치 업데이트
 */
export function updateCurrentLocationMarker(
  marker: naver.maps.Marker,
  position: { lat: number; lng: number }
): void {
  marker.setPosition(new naver.maps.LatLng(position.lat, position.lng));
}
