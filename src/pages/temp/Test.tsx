import { useEffect, useRef, useState } from 'react';
import * as S from './Test.styled';
import { parseGPX } from '@/utils/gpxParser';
import type { GPXData } from '@/utils/gpxParser';

// GPX 파일 import
import gpx24k from '@/assets/course/24k_Course.gpx?url';
import gpx50k from '@/assets/course/50k_Course.gpx?url';

const Test = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<kakao.maps.Map | null>(null);
  const [gpxData, setGpxData] = useState<
    (GPXData & { color: string; index: number })[]
  >([]);
  const polylines = useRef<kakao.maps.Polyline[]>([]);

  // GPX 파일 로드
  useEffect(() => {
    const loadGPXFiles = async () => {
      try {
        const startTime = performance.now();
        const files = [
          { url: gpx24k, color: '#ff4444', name: '24K 코스' },
          { url: gpx50k, color: '#4444ff', name: '50K 코스' },
        ];

        const gpxPromises = files.map(async (file, index) => {
          const fetchStart = performance.now();
          const response = await fetch(file.url);
          const gpxString = await response.text();
          const fetchEnd = performance.now();

          const parseStart = performance.now();
          const data = parseGPX(gpxString);
          const parseEnd = performance.now();

          console.log(`${file.name}:`, {
            fileSize: `${(gpxString.length / 1024).toFixed(1)}KB`,
            points: data.points.length,
            fetchTime: `${(fetchEnd - fetchStart).toFixed(1)}ms`,
            parseTime: `${(parseEnd - parseStart).toFixed(1)}ms`,
          });

          return {
            ...data,
            name: file.name,
            color: file.color,
            index,
          };
        });

        const results = await Promise.all(gpxPromises);
        const endTime = performance.now();

        console.log(`총 로딩 시간: ${(endTime - startTime).toFixed(1)}ms`);
        console.log(
          `총 포인트 수: ${results.reduce(
            (sum, data) => sum + data.points.length,
            0
          )}`
        );

        setGpxData(results);
      } catch (error) {
        console.error('Failed to load GPX files:', error);
      }
    };

    loadGPXFiles();
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_API_KEY
    }&autoload=false`;

    console.log('Loading script:', mapScript.src);

    const onLoadKakaoMap = () => {
      console.log('Kakao map script 로드 완료');
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          // console.log('Kakao maps API ready');
          const container = mapContainer.current;
          if (!container) return;

          const options = {
            center: new window.kakao.maps.LatLng(35.1683, 129.0035), // 부산 근처 좌표 (GPX 파일 위치)
            level: 5, // 지도 확대 레벨
          };

          const map = new window.kakao.maps.Map(container, options);
          mapInstance.current = map;
          // console.log('Map initialized successfully');
        });
      } else {
        console.error('Kakao maps object not found');
      }
    };

    const onErrorKakaoMap = (error: Event) => {
      console.error('Failed to load Kakao map script:', error);
      console.error('Script src:', mapScript.src);
    };

    mapScript.addEventListener('load', onLoadKakaoMap);
    mapScript.addEventListener('error', onErrorKakaoMap);

    document.head.appendChild(mapScript);

    return () => {
      mapScript.removeEventListener('load', onLoadKakaoMap);
      mapScript.removeEventListener('error', onErrorKakaoMap);
      if (document.head.contains(mapScript)) {
        document.head.removeChild(mapScript);
      }
    };
  }, []);

  // GPX 경로를 지도에 그리기
  const drawRoute = (data: GPXData & { color: string; index: number }) => {
    if (!mapInstance.current || !window.kakao) return;

    const renderStart = performance.now();

    // 기존 폴리라인 제거
    polylines.current.forEach(polyline => polyline.setMap(null));
    polylines.current = [];

    // 경로 포인트를 카카오맵 좌표로 변환
    const path = data.points.map(
      point => new window.kakao.maps.LatLng(point.lat, point.lng)
    );

    // 폴리라인 생성
    const polyline = new window.kakao.maps.Polyline({
      path: path,
      strokeWeight: 4,
      strokeColor: data.color,
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    // 지도에 폴리라인 표시
    polyline.setMap(mapInstance.current);
    polylines.current.push(polyline);

    // 경로가 모두 보이도록 지도 범위 조정
    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach(point => bounds.extend(point));
    mapInstance.current.setBounds(bounds);

    const renderEnd = performance.now();
    console.log(
      `${data.name} 렌더링 시간: ${(renderEnd - renderStart).toFixed(1)}ms`
    );
  };

  const showCourse = (index: number) => {
    const course = gpxData[index];
    if (course) {
      drawRoute(course);
    }
  };

  return (
    <S.Container>
      <S.ControlPanel>
        {gpxData.map((course, index) => (
          <S.CourseButton
            key={index}
            color={course.color}
            onClick={() => showCourse(index)}
          >
            {course.name}
          </S.CourseButton>
        ))}
      </S.ControlPanel>
      <S.MapContainer ref={mapContainer} />
    </S.Container>
  );
};

export default Test;
