/**
 * 브라우저 Geolocation API를 사용한 위치 조회 유틸리티
 */

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

/**
 * 사용자의 현재 위치를 가져옵니다.
 * @param options Geolocation API 옵션
 * @returns Promise<LocationCoords> 위치 좌표
 */
export const getUserLocation = (
  options: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 300000, // 5분
  }
): Promise<LocationCoords> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation이 지원되지 않습니다.');
      reject(new Error('Geolocation not supported'));
      return;
    }

    let hasSucceeded = false;
    let errorTimeout: NodeJS.Timeout | null = null;

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log('사용자 위치 조회 성공:', { lat: latitude, lng: longitude });
        hasSucceeded = true;
        
        // 에러 타이머가 있다면 클리어
        if (errorTimeout) {
          clearTimeout(errorTimeout);
          errorTimeout = null;
        }
        
        resolve({ lat: latitude, lng: longitude });
      },
      error => {
        console.warn('위치 조회 실패:', error.message);
        
        // 에러 발생 후 1초 기다려서 성공했는지 확인
        errorTimeout = setTimeout(() => {
          if (!hasSucceeded) {
            // 1초 후에도 성공하지 않았다면 진짜 에러로 처리
            reject(error);
          }
          errorTimeout = null;
        }, 1000);
      },
      options
    );
  });
};
