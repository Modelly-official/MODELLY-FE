// 네이버 지도 API 타입 선언

declare namespace naver.maps {
  class Map {
    constructor(element: HTMLElement | string, options?: MapOptions);
    setCenter(center: LatLng | Coord): void;
    getCenter(): LatLng;
    setZoom(zoom: number, animate?: boolean): void;
    getZoom(): number;
    getBounds(): LatLngBounds;
    panTo(coord: LatLng | Coord, options?: PanOptions): void;
    destroy(): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
    x: number;
    y: number;
  }

  class LatLngBounds {
    constructor(sw: LatLng, ne: LatLng);
    getCenter(): LatLng;
    getNE(): LatLng;
    getSW(): LatLng;
    extend(point: LatLng): LatLngBounds;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    getMap(): Map | null;
    setPosition(position: LatLng | Coord): void;
    getPosition(): LatLng;
    setIcon(icon: string | ImageIcon | SymbolIcon | HtmlIcon): void;
    setVisible(visible: boolean): void;
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, anchor?: Marker | LatLng | Coord): void;
    close(): void;
    setContent(content: string | HTMLElement): void;
  }

  namespace Event {
    function addListener(
      target: Map | Marker | InfoWindow,
      eventName: string,
      handler: (...args: unknown[]) => void
    ): MapEventListener;
    function removeListener(listener: MapEventListener): void;
    function trigger(target: Map | Marker, eventName: string, ...args: unknown[]): void;
  }

  interface MapOptions {
    center?: LatLng | Coord;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    scaleControl?: boolean;
    mapDataControl?: boolean;
    logoControl?: boolean;
    zoomControl?: boolean;
    mapTypeControl?: boolean;
    disableKineticPan?: boolean;
  }

  interface MarkerOptions {
    position: LatLng | Coord;
    map?: Map;
    icon?: string | ImageIcon | SymbolIcon | HtmlIcon;
    title?: string;
    clickable?: boolean;
    draggable?: boolean;
    visible?: boolean;
    zIndex?: number;
  }

  interface ImageIcon {
    url: string;
    size?: Size;
    scaledSize?: Size;
    origin?: Point;
    anchor?: Point;
  }

  interface SymbolIcon {
    path: string;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWeight?: number;
    scale?: number;
  }

  interface HtmlIcon {
    content: string | HTMLElement;
    size?: Size;
    anchor?: Point;
  }

  interface InfoWindowOptions {
    content?: string | HTMLElement;
    position?: LatLng | Coord;
    maxWidth?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    anchorSize?: Size;
    anchorSkew?: boolean;
    pixelOffset?: Point;
  }

  interface PanOptions {
    duration?: number;
    easing?: string;
  }

  interface Coord {
    x: number;
    y: number;
  }

  class Size {
    constructor(width: number, height: number);
    width: number;
    height: number;
  }

  class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
  }

  interface MapEventListener {
    eventName: string;
    listener: (...args: unknown[]) => void;
  }

  type Bounds = LatLngBounds;
}

// Marker 클래스 확장 (getElement 메서드 추가)
declare namespace naver.maps {
  interface Marker {
    getElement(): HTMLElement;
  }
}

// MarkerClustering 라이브러리 타입
interface MarkerClusteringOptions {
  minClusterSize?: number;
  maxZoom?: number;
  map: naver.maps.Map;
  markers: naver.maps.Marker[];
  disableClickZoom?: boolean;
  gridSize?: number;
  icons?: naver.maps.HtmlIcon[];
  indexGenerator?: number[];
  stylingFunction?: (clusterMarker: naver.maps.Marker, count: number) => void;
}

declare class MarkerClustering {
  constructor(options: MarkerClusteringOptions);
  setMap(map: naver.maps.Map | null): void;
  getMap(): naver.maps.Map | null;
  setMarkers(markers: naver.maps.Marker[]): void;
  getMarkers(): naver.maps.Marker[];
  redraw(): void;
}

declare global {
  interface Window {
    naver: typeof naver;
    MarkerClustering: typeof MarkerClustering;
  }
}
