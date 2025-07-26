declare global {
  namespace kakao.maps {
  export class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setBounds(bounds: LatLngBounds): void;
    setCenter(latlng: LatLng): void;
    panTo(latlng: LatLng): void;
  }

  export interface MapOptions {
    center: LatLng;
    level: number;
  }

  export class LatLng {
    constructor(latitude: number, longitude: number);
  }

  export class Polyline {
    constructor(options: PolylineOptions);
    setMap(map: Map | null): void;
  }

  export interface PolylineOptions {
    path: LatLng[];
    strokeWeight: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeStyle: string;
  }

  export class LatLngBounds {
    constructor();
    extend(latlng: LatLng): void;
  }

  export class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
  }

  export interface MarkerOptions {
    position: LatLng;
    image?: MarkerImage;
    title?: string;
    draggable?: boolean;
    clickable?: boolean;
    zIndex?: number;
    opacity?: number;
    range?: number;
  }

  export class MarkerImage {
    constructor(src: string, size: Size, options?: MarkerImageOptions);
  }

  export interface MarkerImageOptions {
    offset?: Point;
    alt?: string;
    shape?: string;
    coords?: string;
  }

  export class Circle {
    constructor(options: CircleOptions);
    setMap(map: Map | null): void;
    setRadius(radius: number): void;
    setPosition(position: LatLng): void;
  }

  export interface CircleOptions {
    center: LatLng;
    radius: number;
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: string;
    fillColor?: string;
    fillOpacity?: number;
  }

  export class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, marker: Marker): void;
    close(): void;
    setContent(content: string): void;
    setPosition(position: LatLng): void;
    setZIndex(zIndex: number): void;
  }

  export interface InfoWindowOptions {
    content?: string;
    position?: LatLng;
    disableAutoPan?: boolean;
    pixelOffset?: Size;
    removable?: boolean;
    zIndex?: number;
  }

  export class Size {
    constructor(width: number, height: number);
  }

  export class Point {
    constructor(x: number, y: number);
  }

  export class CustomOverlay {
    constructor(options: CustomOverlayOptions);
    setMap(map: Map | null): void;
    setPosition(position: LatLng): void;
    setContent(content: string | HTMLElement): void;
    setVisible(visible: boolean): void;
    setZIndex(zIndex: number): void;
  }

  export interface CustomOverlayOptions {
    clickable?: boolean;
    content?: string | HTMLElement;
    map?: Map;
    position?: LatLng;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
  }

  export class MarkerClusterer {
    constructor(options: MarkerClustererOptions);
    addMarkers(markers: Marker[]): void;
    removeMarkers(markers: Marker[]): void;
    clear(): void;
    redraw(): void;
  }

  export interface MarkerClustererOptions {
    map: Map;
    averageCenter?: boolean;
    minLevel?: number;
    disableClickZoom?: boolean;
    gridSize?: number;
    minClusterSize?: number;
    maxLevel?: number;
    texts?: string[];
    calculator?: number[];
    styles?: ClusterStyle[];
  }

  export interface ClusterStyle {
    width: string;
    height: string;
    background: string;
    borderRadius?: string;
    color?: string;
    textAlign?: string;
    fontWeight?: string;
    fontSize?: string;
    lineHeight?: string;
    border?: string;
    boxShadow?: string;
    display?: string;
    alignItems?: string;
    justifyContent?: string;
    minWidth?: string;
    minHeight?: string;
  }

  export namespace event {
    export function addListener(
      target: Map | Marker | Circle | InfoWindow | MarkerClusterer,
      type: string,
      handler: (...args: unknown[]) => void
    ): void;
    export function removeListener(
      target: Map | Marker | Circle | InfoWindow | MarkerClusterer,
      type: string,
      handler: (...args: unknown[]) => void
    ): void;
  }

  export namespace services {
    export interface AddressSearchResult {
      address_name: string;
      x: string;
      y: string;
    }

    export class Geocoder {
      addressSearch(address: string, callback: (result: AddressSearchResult[], status: Status) => void): void;
    }
  }

  export enum Status {
    OK = 'OK',
    ZERO_RESULT = 'ZERO_RESULT',
    ERROR = 'ERROR',
  }
  }

  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: typeof kakao.maps.Map;
        LatLng: typeof kakao.maps.LatLng;
        Polyline: typeof kakao.maps.Polyline;
        LatLngBounds: typeof kakao.maps.LatLngBounds;
        Marker: typeof kakao.maps.Marker;
        InfoWindow: typeof kakao.maps.InfoWindow;
        Circle: typeof kakao.maps.Circle;
        event: typeof kakao.maps.event;
        CustomOverlay: typeof kakao.maps.CustomOverlay;
        Size: typeof kakao.maps.Size;
        Point: typeof kakao.maps.Point;
        MarkerImage: typeof kakao.maps.MarkerImage;
        MarkerClusterer: typeof kakao.maps.MarkerClusterer;
      };
    };
  }
}
