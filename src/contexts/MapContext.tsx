import { createContext, useContext, useRef, type ReactNode, type MutableRefObject } from 'react';
import type { MapViewRef } from '@/components/MapView';

interface MapContextType {
  mapRef: MutableRefObject<MapViewRef | null>;
}

const MapContext = createContext<MapContextType | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const mapRef = useRef<MapViewRef | null>(null);

  return <MapContext.Provider value={{ mapRef }}>{children}</MapContext.Provider>;
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export default MapContext;
