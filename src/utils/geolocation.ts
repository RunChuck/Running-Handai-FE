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
    enableHighAccuracy: false,
    timeout: 15000, // 15초
    maximumAge: 60000, // 1분
  }
): Promise<LocationCoords> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation이 지원되지 않습니다.');
      reject(new Error('Geolocation not supported'));
      return;
    }

    let hasSucceeded = false;
    let retryCount = 0;
    const maxRetries = 2;

    const attemptGetLocation = () => {
      if (import.meta.env.DEV) {
        console.log(`위치 조회 시도 ${retryCount + 1}/${maxRetries + 1}`);
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;

          if (import.meta.env.DEV) {
            console.log('사용자 위치 조회 성공:', { lat: latitude, lng: longitude });
          }

          hasSucceeded = true;
          resolve({ lat: latitude, lng: longitude });
        },
        error => {
          const errorMsg = error.code === 1 ? '권한 거부' : error.code === 2 ? '위치 불가' : '타임아웃';
          console.warn(`위치 조회 실패 (${retryCount + 1}회):`, errorMsg, error.message);

          if (!hasSucceeded && retryCount < maxRetries) {
            retryCount++;

            setTimeout(() => {
              if (!hasSucceeded) {
                attemptGetLocation();
              }
            }, retryCount * 1000);
          } else if (!hasSucceeded) {
            // 모든 재시도 실패
            const finalError =
              error.code === 1
                ? new Error('위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.')
                : error.code === 2
                  ? new Error('현재 위치를 확인할 수 없습니다. 인터넷 연결을 확인해주세요.')
                  : new Error('위치 조회에 실패했습니다. 잠시 후 다시 시도해주세요.');

            reject(finalError);
          }
        },
        options
      );
    };

    attemptGetLocation();
  });
};
