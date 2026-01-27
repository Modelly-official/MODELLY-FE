'use client';

import { useEffect, useRef, useState } from 'react';
import { useNaverMap } from '@/src/providers/NaverMapProvider';
import {
  createShopMarkersForClustering,
  updateMarkerToDefault,
  updateMarkerToSelected,
} from './markers/ShopMarker';
import { createClusteringOptions } from './markers/ClusterMarker';
import {
  createCurrentLocationMarker,
  updateCurrentLocationMarker,
} from './markers/CurrentLocationMarker';
import { MAP_DEFAULTS } from '@/src/constants/map';
import type { MapPosition, MapShopItem } from '@/src/types/map';

const DEFAULT_CENTER: MapPosition = MAP_DEFAULTS.CENTER;
const DEFAULT_ZOOM = MAP_DEFAULTS.ZOOM;

interface NaverMapViewProps {
  center?: MapPosition;
  zoom?: number;
  shops?: MapShopItem[];
  selectedDesignerId?: number;
  userLocation?: MapPosition | null; // 현재 사용자 위치
  bottomOffset?: number; // BottomSheet 높이 (vh 단위)
  bottomOffsetPx?: number; // 하단 오프셋 (px 단위, 우선순위 높음)
  onCenterChanged?: (center: MapPosition) => void;
  onZoomChanged?: (zoom: number) => void;
  onShopClick?: (shop: MapShopItem) => void;
  onMapReady?: (map: naver.maps.Map) => void;
}

export default function NaverMapView({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  shops = [],
  selectedDesignerId,
  userLocation,
  bottomOffset,
  bottomOffsetPx,
  onCenterChanged,
  onZoomChanged,
  onShopClick,
  onMapReady,
}: NaverMapViewProps) {
  const { isLoaded } = useNaverMap();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const clusteringRef = useRef<MarkerClustering | null>(null);
  const listenersRef = useRef<naver.maps.MapEventListener[]>([]);
  // designerId로 마커와 샵 정보를 추적
  const shopMarkerMapRef = useRef<Map<number, { marker: naver.maps.Marker; shop: MapShopItem }>>(
    new Map()
  );
  const prevSelectedDesignerIdRef = useRef<number | undefined>(undefined);
  // 현재 위치 마커
  const currentLocationMarkerRef = useRef<naver.maps.Marker | null>(null);

  // 콜백을 ref로 관리하여 최신 값 유지
  const onCenterChangedRef = useRef(onCenterChanged);
  const onZoomChangedRef = useRef(onZoomChanged);

  // bottomOffset 값을 ref로 관리 (useLatest 패턴)
  // offset은 "center 이동 시 적용할 보정값"이지, "offset 변경 시 지도를 이동"하는 것이 아님
  const bottomOffsetRef = useRef(bottomOffset);
  const bottomOffsetPxRef = useRef(bottomOffsetPx);

  useEffect(() => {
    onCenterChangedRef.current = onCenterChanged;
  }, [onCenterChanged]);

  useEffect(() => {
    onZoomChangedRef.current = onZoomChanged;
  }, [onZoomChanged]);

  useEffect(() => {
    bottomOffsetRef.current = bottomOffset;
  }, [bottomOffset]);

  useEffect(() => {
    bottomOffsetPxRef.current = bottomOffsetPx;
  }, [bottomOffsetPx]);

  // 지도 초기화 (한 번만 실행)
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstance) return;

    const mapOptions: naver.maps.MapOptions = {
      center: new naver.maps.LatLng(center.lat, center.lng),
      zoom,
      scaleControl: false,
      mapDataControl: false,
      logoControl: false,
      zoomControl: false,
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);
    setMapInstance(map);

    // init 이벤트 후에 다른 이벤트 리스너 등록
    naver.maps.Event.addListener(map, 'init', () => {
      // 줌 변경 이벤트
      const zoomListener = naver.maps.Event.addListener(map, 'zoom_changed', () => {
        onZoomChangedRef.current?.(map.getZoom());
      });
      listenersRef.current.push(zoomListener);
    });

    onMapReady?.(map);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // 지도 인스턴스 cleanup
  useEffect(() => {
    return () => {
      // 클러스터링 제거
      if (clusteringRef.current) {
        clusteringRef.current.setMap(null);
        clusteringRef.current = null;
      }

      // 마커 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // 현재 위치 마커 제거
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
        currentLocationMarkerRef.current = null;
      }

      // 이벤트 리스너 제거
      listenersRef.current.forEach((listener) => {
        naver.maps.Event.removeListener(listener);
      });
      listenersRef.current = [];

      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, [mapInstance]);

  // shops 변경 시 마커 및 클러스터링 업데이트
  useEffect(() => {
    if (!mapInstance) return;

    // 기존 클러스터링 제거
    if (clusteringRef.current) {
      clusteringRef.current.setMap(null);
      clusteringRef.current = null;
    }

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    shopMarkerMapRef.current.clear();

    // 새 마커 생성 (map에 추가하지 않음 - 클러스터링이 관리)
    const markers = createShopMarkersForClustering(shops, onShopClick);
    markersRef.current = markers;

    // shopMarkerMap 구축 (designerId를 key로 사용)
    shops.forEach((shop, index) => {
      shopMarkerMapRef.current.set(shop.designerId, {
        marker: markers[index],
        shop,
      });
    });

    // 클러스터링 생성
    if (markers.length > 0) {
      const clusteringOptions = createClusteringOptions({
        map: mapInstance,
        markers,
        minClusterSize: 2,
        maxZoom: 16,
        gridSize: 120,
      });

      clusteringRef.current = new MarkerClustering(clusteringOptions);
    }
  }, [mapInstance, shops, onShopClick]);

  // selectedDesignerId 변경 시 마커 아이콘 업데이트
  useEffect(() => {
    const prevId = prevSelectedDesignerIdRef.current;

    // 이전 선택된 마커를 기본 상태로 되돌림
    if (prevId !== undefined) {
      const prevData = shopMarkerMapRef.current.get(prevId);
      if (prevData) {
        updateMarkerToDefault(prevData.marker, prevData.shop.category);
      }
    }

    // 새로 선택된 마커를 선택 상태로 변경
    if (selectedDesignerId !== undefined) {
      const selectedData = shopMarkerMapRef.current.get(selectedDesignerId);
      if (selectedData) {
        updateMarkerToSelected(
          selectedData.marker,
          selectedData.shop.category,
          selectedData.shop.shopName
        );
      }
    }

    prevSelectedDesignerIdRef.current = selectedDesignerId;
  }, [selectedDesignerId]);

  // center prop 변경 감지 - primitive 의존성 사용
  useEffect(() => {
    if (!mapInstance) return;

    // 실제 지도의 현재 중심 좌표를 가져옴
    const currentMapCenter = mapInstance.getCenter();

    const isSameAsMapCenter =
      Math.abs(currentMapCenter.y - center.lat) < 0.0001 &&
      Math.abs(currentMapCenter.x - center.lng) < 0.0001;

    if (!isSameAsMapCenter) {
      let targetCoord: naver.maps.LatLng | naver.maps.Coord = new naver.maps.LatLng(
        center.lat,
        center.lng
      );

      // 하단 오프셋 보정 (ref에서 최신 값 읽음)
      const offsetPx =
        bottomOffsetPxRef.current ?? ((bottomOffsetRef.current ?? 0) / 100) * window.innerHeight;
      if (offsetPx > 0) {
        const projection = mapInstance.getProjection();
        const pixelOffset = projection.fromCoordToOffset(targetCoord);

        // 지도 중심을 아래로 이동 → 사용자 위치가 보이는 영역 중앙으로 올라감
        pixelOffset.y += offsetPx / 2;

        targetCoord = projection.fromOffsetToCoord(pixelOffset);
      }

      mapInstance.panTo(targetCoord, {
        duration: 300,
        easing: 'easeOutCubic',
      });
    }
  }, [mapInstance, center.lat, center.lng]);

  // zoom 변경 시 지도 줌 변경
  useEffect(() => {
    if (mapInstance && zoom !== mapInstance.getZoom()) {
      mapInstance.setZoom(zoom);
    }
  }, [mapInstance, zoom]);

  // 현재 위치 마커 생성/업데이트
  useEffect(() => {
    if (!mapInstance) return;

    if (userLocation) {
      if (currentLocationMarkerRef.current) {
        // 기존 마커 위치 업데이트
        updateCurrentLocationMarker(currentLocationMarkerRef.current, userLocation);
      } else {
        // 새 마커 생성
        const marker = createCurrentLocationMarker(userLocation);
        marker.setMap(mapInstance);
        currentLocationMarkerRef.current = marker;
      }
    } else {
      // 위치 정보가 없으면 마커 제거
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
        currentLocationMarkerRef.current = null;
      }
    }
  }, [mapInstance, userLocation]);

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <span className="text-body-2-medium text-gray-600">지도를 불러오는 중...</span>
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full" />;
}
