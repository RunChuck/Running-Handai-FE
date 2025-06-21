/**
 * 지도에서 사용하는 위치 좌표 상수들
 */

export const BUSAN_CITY_HALL = {
  lat: 35.17992598569,
  lng: 129.07509523457,
} as const;

export const DEFAULT_MAP_LEVEL = 7;

// 추천 코스 지역별 좌표
export const COURSE_LOCATIONS = {
  해운대: {
    lat: 35.1627995,
    lng: 129.1371227,
  },
  송정기장: {
    lat: 35.188314,
    lng: 129.2232312,
  },
  서면동래: {
    lat: 35.1666396,
    lng: 129.0552696,
  },
  원도심영도: {
    lat: 35.1006679,
    lng: 129.0324484,
  },
  남부해안: {
    lat: 35.1257997,
    lng: 129.1003063,
  },
  서부낙동강: {
    lat: 35.1363725,
    lng: 128.9220322,
  },
  북부산: {
    lat: 35.2199017,
    lng: 129.075078,
  },
} as const;
