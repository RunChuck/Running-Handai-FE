import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import type { RouteViewMapInstance } from '@/pages/courseCreation/components/RouteView';

export interface MarkerPosition {
  lat: number;
  lng: number;
}

export interface CourseAction {
  type: 'ADD_MARKER' | 'REMOVE_MARKER' | 'MOVE_MARKER' | 'CLEAR_ALL' | 'GPX_UPLOAD' | 'SWAP_MARKERS';
  payload?: MarkerPosition;
  markerIndex?: number;
  newPosition?: MarkerPosition; // 마커 이동 시 새 위치 저장 (redo용)
  previousMarkers?: MarkerPosition[]; // swap을 위한 이전 마커 배열 저장
}

export interface ButtonStates {
  gpx: boolean;
  undo: boolean;
  redo: boolean;
  swap: boolean;
  delete: boolean;
  create: boolean;
}

export interface GPXData {
  coordinates: MarkerPosition[];
  distance: number;
  time: number;
  maxAltitude: number;
  minAltitude: number;
}

interface CourseCreationContextType {
  // 상태
  markers: MarkerPosition[];
  undoStack: CourseAction[];
  redoStack: CourseAction[];
  isGpxUploaded: boolean;
  gpxData: GPXData | null;
  mapInstance: RouteViewMapInstance | null;
  buttonStates: ButtonStates;

  // 액션
  handleMarkersChange: (newMarkers: MarkerPosition[]) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleGpxUpload: (file: File) => Promise<void>;
  handleSwap: () => void;
  handleDelete: () => void;
  handleCourseCreate: () => Promise<void>;
  setMapInstance: (instance: RouteViewMapInstance) => void;

  // 로딩 상태
  isLoading: boolean;
  error: string | null;
}

const CourseCreationContext = createContext<CourseCreationContextType | undefined>(undefined);

interface CourseCreationProviderProps {
  children: ReactNode;
}

export const CourseCreationProvider = ({ children }: CourseCreationProviderProps) => {
  // 상태
  const [markers, setMarkers] = useState<MarkerPosition[]>([]);
  const [undoStack, setUndoStack] = useState<CourseAction[]>([]);
  const [redoStack, setRedoStack] = useState<CourseAction[]>([]);
  const [isGpxUploaded, setIsGpxUploaded] = useState(false);
  const [gpxData, setGpxData] = useState<GPXData | null>(null);
  const [mapInstance, setMapInstance] = useState<RouteViewMapInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUndoRedoInProgress = useRef(false);
  const previousMarkersRef = useRef<MarkerPosition[]>([]);

  // 버튼 활성화 상태
  const buttonStates: ButtonStates = {
    gpx: markers.length === 0 && !isGpxUploaded,
    undo: undoStack.length > 0,
    redo: redoStack.length > 0,
    swap: markers.length >= 2,
    delete: markers.length > 0,
    create: markers.length >= 2,
  };

  // 실행취소/재실행 처리
  const executeAction = (action: CourseAction) => {
    console.log('📍 새 액션 추가:', action.type, action.markerIndex, action.payload);
    setUndoStack(prev => {
      const newStack = [...prev, action];
      console.log(
        '📚 현재 undoStack 길이:',
        newStack.length,
        newStack.map(a => a.type)
      );
      return newStack;
    });
    setRedoStack([]); // 새 작업 시 redo 스택 초기화
  };

  // 마커 상태 변경 핸들러 (지도에서 직접 추가/이동 시)
  const handleMarkersChange = (newMarkers: MarkerPosition[]) => {
    const previousMarkers = previousMarkersRef.current;
    console.log('🔄 마커 변경:', { prev: previousMarkers.length, new: newMarkers.length });

    setMarkers(newMarkers);
    previousMarkersRef.current = newMarkers; // 이전 상태 업데이트

    // undo/redo 중이 아닐 때만 새 액션 추가
    if (!isUndoRedoInProgress.current) {
      if (newMarkers.length > previousMarkers.length) {
        // 마커 추가
        const addedMarker = newMarkers[newMarkers.length - 1];
        const action: CourseAction = {
          type: 'ADD_MARKER',
          payload: addedMarker,
          markerIndex: newMarkers.length - 1,
        };
        executeAction(action);
      } else if (newMarkers.length === previousMarkers.length) {
        // 마커 이동 - 변경된 마커 찾기
        for (let i = 0; i < newMarkers.length; i++) {
          const prev = previousMarkers[i];
          const curr = newMarkers[i];
          if (prev && (prev.lat !== curr.lat || prev.lng !== curr.lng)) {
            const action: CourseAction = {
              type: 'MOVE_MARKER',
              payload: prev, // 이전 위치 저장 (undo용)
              newPosition: curr, // 새 위치 저장 (redo용)
              markerIndex: i,
            };
            executeAction(action);
            break; // 한 번에 하나의 마커만 이동 가능
          }
        }
      }
    }
  };

  const handleUndo = () => {
    if (undoStack.length === 0 || !mapInstance) return;

    isUndoRedoInProgress.current = true;

    const lastAction = undoStack[undoStack.length - 1];
    console.log('⏪ Undo 실행:', lastAction.type, lastAction.markerIndex, lastAction.payload);
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, lastAction]);

    if (lastAction.type === 'ADD_MARKER') {
      // 마지막 마커 제거
      const newMarkers = markers.slice(0, -1);
      setMarkers(newMarkers);
      previousMarkersRef.current = newMarkers; // ref 업데이트
      mapInstance.removeLastMarker();
    } else if (lastAction.type === 'MOVE_MARKER' && lastAction.payload && lastAction.markerIndex !== undefined) {
      // 마커를 이전 위치로 이동
      const newMarkers = [...markers];
      newMarkers[lastAction.markerIndex] = lastAction.payload;
      setMarkers(newMarkers);
      previousMarkersRef.current = newMarkers; // ref 업데이트
      mapInstance.moveMarkerTo(lastAction.markerIndex, lastAction.payload.lat, lastAction.payload.lng);
    } else if (lastAction.type === 'SWAP_MARKERS' && lastAction.previousMarkers) {
      // 이전 마커 순서로 복원
      setMarkers(lastAction.previousMarkers);
      previousMarkersRef.current = lastAction.previousMarkers;
      mapInstance.swapMarkers(lastAction.previousMarkers);
    }

    isUndoRedoInProgress.current = false;
  };

  const handleRedo = () => {
    if (redoStack.length === 0 || !mapInstance) return;

    isUndoRedoInProgress.current = true;

    const redoAction = redoStack[redoStack.length - 1];
    console.log('⏩ Redo 실행:', redoAction.type, redoAction.markerIndex, redoAction.newPosition);
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, redoAction]);

    if (redoAction.type === 'ADD_MARKER' && redoAction.payload) {
      // 마커 다시 추가
      const newMarkers = [...markers, redoAction.payload];
      setMarkers(newMarkers);
      previousMarkersRef.current = newMarkers; // ref 업데이트
      mapInstance.addMarkerAt(redoAction.payload.lat, redoAction.payload.lng);
    } else if (redoAction.type === 'MOVE_MARKER' && redoAction.newPosition && redoAction.markerIndex !== undefined) {
      // 마커를 다시 새 위치로 이동 (redo는 newPosition 사용)
      const newMarkers = [...markers];
      newMarkers[redoAction.markerIndex] = redoAction.newPosition;
      setMarkers(newMarkers);
      previousMarkersRef.current = newMarkers; // ref 업데이트
      mapInstance.moveMarkerTo(redoAction.markerIndex, redoAction.newPosition.lat, redoAction.newPosition.lng);
    } else if (redoAction.type === 'SWAP_MARKERS') {
      // swap 다시 실행 (현재 마커들을 역순으로)
      const swappedMarkers = [markers[markers.length - 1], ...markers.slice(1, -1).reverse(), markers[0]];
      setMarkers(swappedMarkers);
      previousMarkersRef.current = swappedMarkers;
      mapInstance.swapMarkers(swappedMarkers);
    }

    isUndoRedoInProgress.current = false;
  };

  const handleGpxUpload = async (_file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: GPX 파일 파싱 로직 구현
      // const parsedGpx = await parseGPXFile(file);
      // setGpxData(parsedGpx);
      // setMarkers(parsedGpx.coordinates);

      setIsGpxUploaded(true);
      executeAction({ type: 'GPX_UPLOAD' });
    } catch (err) {
      setError('GPX 파일 업로드 중 오류가 발생했습니다.');
      console.error('GPX upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    if (markers.length < 2 || !mapInstance) return;

    isUndoRedoInProgress.current = true;

    // 현재 마커 순서 저장 (undo를 위해)
    const currentMarkers = [...markers];
    
    // 출발지, 도착지를 바꾸고 나머지는 역순
    const swappedMarkers = [markers[markers.length - 1], ...markers.slice(1, -1).reverse(), markers[0]];
    
    setMarkers(swappedMarkers);
    previousMarkersRef.current = swappedMarkers;
    
    // 지도 업데이트
    mapInstance.swapMarkers(swappedMarkers);
    
    // undo 스택에 추가
    executeAction({
      type: 'SWAP_MARKERS',
      previousMarkers: currentMarkers,
    });

    isUndoRedoInProgress.current = false;
  };

  const handleDelete = () => {
    if (markers.length === 0 || !mapInstance) return;

    // 초기화는 모든 상태 완전 리셋 (undo/redo 불가)
    setMarkers([]);
    previousMarkersRef.current = []; // ref 업데이트
    setUndoStack([]);
    setRedoStack([]);
    setIsGpxUploaded(false);
    setGpxData(null);
    mapInstance.clearAllMarkers();
  };

  const handleCourseCreate = async () => {
    if (markers.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // TODO: 코스 생성 API 호출
      // const courseData = {
      //   markers,
      //   gpxData,
      //   distance: gpxData?.distance || 0,
      //   time: gpxData?.time || 0,
      //   maxAltitude: gpxData?.maxAltitude || 0,
      //   minAltitude: gpxData?.minAltitude || 0,
      // };
      // await createCourse(courseData);

      console.log('코스 생성:', { markers, gpxData });
    } catch (err) {
      setError('코스 생성 중 오류가 발생했습니다.');
      console.error('Course creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value: CourseCreationContextType = {
    // 상태
    markers,
    undoStack,
    redoStack,
    isGpxUploaded,
    gpxData,
    mapInstance,
    buttonStates,

    // 액션
    handleMarkersChange,
    handleUndo,
    handleRedo,
    handleGpxUpload,
    handleSwap,
    handleDelete,
    handleCourseCreate,
    setMapInstance,

    // 로딩 상태
    isLoading,
    error,
  };

  return <CourseCreationContext.Provider value={value}>{children}</CourseCreationContext.Provider>;
};

export const useCourseCreation = () => {
  const context = useContext(CourseCreationContext);
  if (context === undefined) {
    throw new Error('useCourseCreation must be used within a CourseCreationProvider');
  }
  return context;
};
