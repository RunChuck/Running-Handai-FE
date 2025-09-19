import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { RouteViewMapInstance } from '@/pages/courseCreation/components/RouteView';
import { createCourse, checkIsInBusan, checkCourseName } from '@/api/create';
import { generateGPXFile } from '@/utils/gpxGenerator';
import { convertImageToWebP } from '@/utils/imageConverter';
import { useToast } from '@/hooks/useToast';

export interface MarkerPosition {
  lat: number;
  lng: number;
  ele?: number;
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

export interface RouteState {
  isRouteGenerated: boolean;
}

interface CourseCreationContextType {
  // 상태
  markers: MarkerPosition[];
  undoStack: CourseAction[];
  redoStack: CourseAction[];
  isGpxUploaded: boolean;
  gpxData: GPXData | null;
  uploadedGpxFile: File | null;
  mapInstance: RouteViewMapInstance | null;
  buttonStates: ButtonStates;
  isRouteGenerated: boolean;
  isInBusan: boolean | null;
  hasCheckedLocation: boolean;

  // 코스명 상태
  startPoint: string;
  endPoint: string;
  setStartPoint: (value: string) => void;
  setEndPoint: (value: string) => void;

  // 액션
  handleMarkersChange: (newMarkers: MarkerPosition[]) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleGpxUpload: (file: File) => Promise<void>;
  handleSwap: () => void;
  handleDelete: () => void;
  handleCourseCreate: () => Promise<void>;
  handleCourseValidation: () => Promise<{ isDuplicate: boolean; message?: string }>;
  submitCourse: (courseData: { startPoint: string; endPoint: string; thumbnailBlob: Blob; isInBusan: boolean }) => Promise<number>;
  setMapInstance: (instance: RouteViewMapInstance) => void;

  // 로딩 상태
  isLoading: boolean;
  isSavingCourse: boolean;
  error: string | null;
}

const CourseCreationContext = createContext<CourseCreationContextType | undefined>(undefined);

interface CourseCreationProviderProps {
  children: ReactNode;
}

export const CourseCreationProvider = ({ children }: CourseCreationProviderProps) => {
  const [t] = useTranslation();
  const { showErrorToast } = useToast();

  // 상태
  const [markers, setMarkers] = useState<MarkerPosition[]>([]);
  const [undoStack, setUndoStack] = useState<CourseAction[]>([]);
  const [redoStack, setRedoStack] = useState<CourseAction[]>([]);
  const [isGpxUploaded, setIsGpxUploaded] = useState(false);
  const [gpxData, setGpxData] = useState<GPXData | null>(null);
  const [uploadedGpxFile, setUploadedGpxFile] = useState<File | null>(null);
  const [mapInstance, setMapInstance] = useState<RouteViewMapInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRouteGenerated, setIsRouteGenerated] = useState(false);
  const [isInBusan, setIsInBusan] = useState<boolean | null>(null);
  const [hasCheckedLocation, setHasCheckedLocation] = useState(false);

  // 코스명 상태
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');

  const isUndoRedoInProgress = useRef(false);
  const previousMarkersRef = useRef<MarkerPosition[]>([]);

  // 버튼 활성화 상태
  const buttonStates: ButtonStates = {
    gpx: markers.length === 0 && !isGpxUploaded && !isRouteGenerated,
    undo: undoStack.length > 0 && !isRouteGenerated && !isGpxUploaded,
    redo: redoStack.length > 0 && !isRouteGenerated && !isGpxUploaded,
    swap: markers.length >= 2 && !isRouteGenerated && !isGpxUploaded,
    delete: markers.length > 0 || isGpxUploaded || isRouteGenerated,
    create: (markers.length >= 2 && !isRouteGenerated) || isGpxUploaded,
  };

  // 실행취소/재실행 처리
  const executeAction = (action: CourseAction) => {
    // console.log('📍 새 액션 추가:', action.type, action.markerIndex, action.payload);
    setUndoStack(prev => {
      const newStack = [...prev, action];
      return newStack;
    });
    setRedoStack([]); // 새 작업 시 redo 스택 초기화
  };

  // 마커 상태 변경 핸들러 (지도에서 직접 추가/이동 시)
  const handleMarkersChange = (newMarkers: MarkerPosition[]) => {
    const previousMarkers = previousMarkersRef.current;

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
    if (undoStack.length === 0 || !mapInstance || isRouteGenerated) return;

    isUndoRedoInProgress.current = true;

    const lastAction = undoStack[undoStack.length - 1];

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
    if (redoStack.length === 0 || !mapInstance || isRouteGenerated) return;

    isUndoRedoInProgress.current = true;

    const redoAction = redoStack[redoStack.length - 1];

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

  const handleGpxUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // 업로드된 GPX 파일 저장
      setUploadedGpxFile(file);

      // GPX 파일을 텍스트로 읽기
      const fileText = await file.text();
      const { parseGPX } = await import('@/utils/gpxParser');
      const parsedGpx = parseGPX(fileText);

      if (parsedGpx.points.length === 0) {
        throw new Error('유효한 경로 데이터가 없습니다.');
      }

      // 거리 및 고도 계산 유틸 임포트
      const { calculateTotalDistance, convertToKilometers, calculateEstimatedTime, calculateElevationStats } = await import(
        '@/utils/distanceCalculator'
      );

      // 거리 계산
      const distanceInMeters = calculateTotalDistance(parsedGpx.points);
      const distanceInKm = convertToKilometers(distanceInMeters);
      const time = calculateEstimatedTime(distanceInKm, 9); // 9km/h 기준

      // 고도 정보 계산
      const elevationStats = calculateElevationStats(parsedGpx.points);

      // GPX 데이터 설정
      const gpxData: GPXData = {
        coordinates: parsedGpx.points.map(p => ({ lat: p.lat, lng: p.lng })),
        distance: distanceInKm,
        time,
        maxAltitude: elevationStats.maxAltitude,
        minAltitude: elevationStats.minAltitude,
      };

      setGpxData(gpxData);
      setIsGpxUploaded(true);
      setIsRouteGenerated(true); // GPX 업로드시에도 경로 생성 상태로 설정

      // 마커는 빈 배열로 설정 (GPX는 마커가 아닌 경로 자체)
      setMarkers([]);
      previousMarkersRef.current = [];

      // 지도에 GPX 경로 표시
      if (mapInstance) {
        mapInstance.clearAllMarkers(); // 기존 마커 제거
        mapInstance.displayRoute(gpxData.coordinates); // GPX 경로 표시
      }

      executeAction({ type: 'GPX_UPLOAD' });
    } catch (err) {
      setError('GPX 파일 업로드 중 오류가 발생했습니다.');
      console.error('GPX upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    if (markers.length < 2 || !mapInstance || isRouteGenerated) return;

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
    if ((markers.length === 0 && !isGpxUploaded && !isRouteGenerated) || !mapInstance) return;

    // 초기화는 모든 상태 완전 리셋 (undo/redo 불가)
    setMarkers([]);
    previousMarkersRef.current = []; // ref 업데이트
    setUndoStack([]);
    setRedoStack([]);
    setIsGpxUploaded(false);
    setGpxData(null);
    setIsRouteGenerated(false); // 경로 생성 상태 리셋
    setIsInBusan(null); // 부산 지역 체크 상태 리셋
    setHasCheckedLocation(false);
    setStartPoint(''); // 출발지 초기화
    setEndPoint(''); // 도착지 초기화
    mapInstance.clearAllMarkers();
    mapInstance.clearRoute(); // 경로도 함께 제거
  };

  const handleCourseCreate = async () => {
    if ((!isGpxUploaded && markers.length < 2) || !mapInstance) return;

    // GPX가 이미 업로드된 경우 추가 처리 없이 완료 처리만
    if (isGpxUploaded && gpxData) {
      setIsRouteGenerated(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // OpenRoute API를 사용해서 경로 계산
      const { planRouteFromCoordinates } = await import('@/utils/routeUtils');
      const { calculateElevationStats } = await import('@/utils/distanceCalculator');

      const routeResult = await planRouteFromCoordinates(markers, 'foot-walking');

      // 고도 통계 계산
      const elevationStats = calculateElevationStats(routeResult.coordinates);

      // GPX 데이터 업데이트
      const newGpxData: GPXData = {
        coordinates: routeResult.coordinates,
        distance: Math.round(routeResult.distance),
        time: Math.round((routeResult.distance / 9) * 60), // 9km/h 기준
        maxAltitude: elevationStats.maxAltitude,
        minAltitude: elevationStats.minAltitude,
      };

      setGpxData(newGpxData);
      setIsRouteGenerated(true); // 경로 생성 완료 상태로 설정

      // 지도에 경로 표시
      mapInstance.displayRoute(routeResult.coordinates);
    } catch (err) {
      let toastMessage = t('toast.courseCreation.ServerError');

      if (err instanceof Error && 'status' in err) {
        const status = (err as Error & { status: number }).status;
        if (status === 400 || status === 404) {
          toastMessage = t('toast.courseCreation.InvalidLocation');
        }
      }

      showErrorToast(toastMessage, { position: 'top' });
      handleDelete();
      console.error('Course creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleCourseValidation = async () => {
    const courseName = `${startPoint}-${endPoint}`;

    try {
      setIsLoading(true);

      // 1. 코스명 중복 검사
      const nameCheckResponse = await checkCourseName(courseName);
      if (nameCheckResponse.data === true) {
        return { isDuplicate: true };
      }

      // 2. 부산 지역 체크
      const coordinates = isGpxUploaded && gpxData?.coordinates ? gpxData.coordinates : gpxData?.coordinates || [];
      if (coordinates.length > 0) {
        const startCoordinate = coordinates[0];
        const locationResult = await checkIsInBusan({
          lat: startCoordinate.lat,
          lon: startCoordinate.lng,
        });

        setIsInBusan(locationResult.data);
        setHasCheckedLocation(true);
      }

      return { isDuplicate: false };
    } catch (error) {
      console.error('Course validation error:', error);
      // 에러가 발생해도 진행 허용
      return { isDuplicate: false };
    } finally {
      setIsLoading(false);
    }
  };


  const submitCourse = async (courseData: { startPoint: string; endPoint: string; thumbnailBlob: Blob; isInBusan: boolean }): Promise<number> => {
    setIsSavingCourse(true);
    setError(null);

    try {
      const { startPoint, endPoint, thumbnailBlob, isInBusan } = courseData;

      // 좌표 데이터 확인
      const coordinates = isGpxUploaded && gpxData?.coordinates ? gpxData.coordinates : gpxData?.coordinates || [];
      if (!coordinates.length) {
        throw new Error('경로 데이터가 없습니다.');
      }

      let gpxFile: File;

      if (isGpxUploaded && uploadedGpxFile) {
        // GPX 파일이 업로드된 경우: 기존 파일 사용
        gpxFile = uploadedGpxFile;
      } else {
        // 마커로 경로를 생성한 경우: 새 GPX 파일 생성
        const trackPoints = coordinates.map((coord, index) => ({
          lat: coord.lat,
          lng: coord.lng,
          elevation: coord.ele || 0,
          time: new Date(Date.now() + index * 1000),
        }));

        gpxFile = generateGPXFile(trackPoints, {
          trackName: `${startPoint} → ${endPoint}`,
          description: `Course from ${startPoint} to ${endPoint}`,
          creator: 'Running Handai',
        });

        // 디버깅을 위해 생성된 GPX 파일 다운로드
        // if (process.env.NODE_ENV === 'development') {
        //   const url = URL.createObjectURL(gpxFile);
        //   const a = document.createElement('a');
        //   a.href = url;
        //   a.download = `debug-${startPoint}-${endPoint}.gpx`;
        //   document.body.appendChild(a);
        //   a.click();
        //   document.body.removeChild(a);
        //   URL.revokeObjectURL(url);
        // }
      }

      // 썸네일 이미지를 800x800 WebP로 변환
      const thumbnailFile = await convertImageToWebP(thumbnailBlob, {
        width: 800,
        height: 800,
        quality: 0.95,
        format: 'webp',
      });

      const apiCourseData = {
        startPointName: startPoint,
        endPointName: endPoint,
        gpxFile,
        thumbnailImage: thumbnailFile,
        isInsideBusan: isInBusan,
      };

      const result = await createCourse(apiCourseData);
      return result.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || '코스 등록 중 오류가 발생했습니다.';
      setError(errorMessage);

      // 중복 코스명이 아닌 경우에만 Context에서 토스트 표시
      if (error?.response?.data?.responseCode !== 'DUPLICATE_COURSE_NAME') {
        showErrorToast(errorMessage, { position: 'top' });
      }

      throw error;
    } finally {
      setIsSavingCourse(false);
    }
  };

  const value: CourseCreationContextType = {
    // 상태
    markers,
    undoStack,
    redoStack,
    isGpxUploaded,
    gpxData,
    uploadedGpxFile,
    mapInstance,
    buttonStates,
    isRouteGenerated,
    isInBusan,
    hasCheckedLocation,

    // 코스명 상태
    startPoint,
    endPoint,
    setStartPoint,
    setEndPoint,

    // 액션
    handleMarkersChange,
    handleUndo,
    handleRedo,
    handleGpxUpload,
    handleSwap,
    handleDelete,
    handleCourseCreate,
    handleCourseValidation,
    submitCourse,
    setMapInstance,

    // 로딩 상태
    isLoading,
    isSavingCourse,
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
