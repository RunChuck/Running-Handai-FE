declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: typeof kakao.maps.Map;
        LatLng: typeof kakao.maps.LatLng;
        Polyline: typeof kakao.maps.Polyline;
        LatLngBounds: typeof kakao.maps.LatLngBounds;
      };
    };
  }
}

declare namespace kakao.maps {
  export class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setBounds(bounds: LatLngBounds): void;
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

  export namespace services {
    export interface AddressSearchResult {
      address_name: string;
      x: string;
      y: string;
    }

    export class Geocoder {
      addressSearch(
        address: string,
        callback: (result: AddressSearchResult[], status: Status) => void
      ): void;
    }
  }

  export enum Status {
    OK = 'OK',
    ZERO_RESULT = 'ZERO_RESULT',
    ERROR = 'ERROR',
  }
}

export {};
