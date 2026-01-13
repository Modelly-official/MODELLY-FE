// 클러스터 마커 유틸리티
import { MARKER_COLOR } from './ShopMarker';

// 클러스터 마커 크기
const CLUSTER_SIZE = 40;

// 클러스터 마커 HTML 생성
function createClusterHtml(): string {
  return `
    <div style="
      cursor: pointer;
      width: ${CLUSTER_SIZE}px;
      height: ${CLUSTER_SIZE}px;
      border-radius: 50%;
      background-color: ${MARKER_COLOR};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    ">
      <span style="
        color: white;
        font-size: 14px;
        font-weight: 600;
      "></span>
    </div>
  `;
}

// 클러스터 아이콘 설정 생성 함수
export function createClusterIcon() {
  return {
    content: createClusterHtml(),
    size: new naver.maps.Size(CLUSTER_SIZE, CLUSTER_SIZE),
    anchor: new naver.maps.Point(CLUSTER_SIZE / 2, CLUSTER_SIZE / 2),
  };
}

// 클러스터링 스타일링 함수 (클러스터 마커에 개수 표시)
export function clusterStylingFunction(
  clusterMarker: naver.maps.Marker,
  count: number
): void {
  const element = clusterMarker.getElement() as HTMLElement;
  const span = element.querySelector('span');
  if (span) {
    span.textContent = count.toString();
  }
}

// 클러스터링 옵션 생성
export interface ClusteringOptions {
  map: naver.maps.Map;
  markers: naver.maps.Marker[];
  minClusterSize?: number;
  maxZoom?: number;
  gridSize?: number;
  disableClickZoom?: boolean;
}

export function createClusteringOptions({
  map,
  markers,
  minClusterSize = 2,
  maxZoom = 16,
  gridSize = 120,
  disableClickZoom = false,
}: ClusteringOptions) {
  return {
    minClusterSize,
    maxZoom,
    map,
    markers,
    disableClickZoom,
    gridSize,
    icons: [createClusterIcon()],
    indexGenerator: [10, 100, 200, 500, 1000],
    stylingFunction: clusterStylingFunction,
  };
}
