'use client';

import { useEffect, useRef } from 'react';
import { useNaverMap } from '@/src/providers/NaverMapProvider';
import type { MapPosition } from '@/src/types/map';

// 서울 강남역 기본 좌표
const DEFAULT_CENTER: MapPosition = {
  lat: 37.4979,
  lng: 127.0276,
};

const DEFAULT_ZOOM = 15;

interface NaverMapViewProps {
  center?: MapPosition;
  zoom?: number;
  onCenterChanged?: (center: MapPosition) => void;
  onZoomChanged?: (zoom: number) => void;
  onMapReady?: (map: naver.maps.Map) => void;
}

export default function NaverMapView({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  onCenterChanged,
  onZoomChanged,
  onMapReady,
}: NaverMapViewProps) {
  const { isLoaded } = useNaverMap();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const listenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const isUserInteractionRef = useRef(false);
  const lastCenterRef = useRef<MapPosition>(center);

  // 지도 초기화 (한 번만 실행)
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const mapOptions: naver.maps.MapOptions = {
      center: new naver.maps.LatLng(center.lat, center.lng),
      zoom,
      scaleControl: false,
      mapDataControl: false,
      logoControl: false,
      zoomControl: false,
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    // 드래그 시작 시 사용자 인터랙션 플래그 설정
    const dragStartListener = naver.maps.Event.addListener(map, 'dragstart', () => {
      isUserInteractionRef.current = true;
    });
    listenersRef.current.push(dragStartListener);

    // center 변경 이벤트 (사용자 인터랙션일 때만 콜백 호출)
    if (onCenterChanged) {
      const listener = naver.maps.Event.addListener(map, 'dragend', () => {
        if (isUserInteractionRef.current) {
          const newCenter = map.getCenter();
          const newPosition = {
            lat: newCenter.y,
            lng: newCenter.x,
          };
          lastCenterRef.current = newPosition;
          onCenterChanged(newPosition);
          isUserInteractionRef.current = false;
        }
      });
      listenersRef.current.push(listener);
    }

    if (onZoomChanged) {
      const listener = naver.maps.Event.addListener(map, 'zoom_changed', () => {
        onZoomChanged(map.getZoom());
      });
      listenersRef.current.push(listener);
    }

    onMapReady?.(map);

    // Cleanup
    return () => {
      listenersRef.current.forEach((listener) => {
        naver.maps.Event.removeListener(listener);
      });
      listenersRef.current = [];

      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // center prop 변경 감지 (외부에서 변경 시에만 지도 이동)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const isSameCenter =
      Math.abs(lastCenterRef.current.lat - center.lat) < 0.0001 &&
      Math.abs(lastCenterRef.current.lng - center.lng) < 0.0001;

    if (!isSameCenter) {
      lastCenterRef.current = center;
      mapInstanceRef.current.setCenter(
        new naver.maps.LatLng(center.lat, center.lng)
      );
    }
  }, [center]);

  // zoom 변경 시 지도 줌 변경
  useEffect(() => {
    if (mapInstanceRef.current && zoom !== mapInstanceRef.current.getZoom()) {
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [zoom]);

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <span className="text-body-2-medium text-gray-600">지도를 불러오는 중...</span>
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full" />;
}
