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
  HAEUN_GWANGAN: {
    lat: 35.1627995,
    lng: 129.1371227,
  },
  SONGJEONG_GIJANG: {
    lat: 35.188314,
    lng: 129.2232312,
  },
  SEOMYEON_DONGNAE: {
    lat: 35.1666396,
    lng: 129.0552696,
  },
  WONDOSIM: {
    lat: 35.1006679,
    lng: 129.0324484,
  },
  SOUTHERN_COAST: {
    lat: 35.1257997,
    lng: 129.1003063,
  },
  WESTERN_NAKDONGRIVER: {
    lat: 35.1363725,
    lng: 128.9220322,
  },
  NORTHERN_BUSAN: {
    lat: 35.2199017,
    lng: 129.075078,
  },
} as const;

// 테마별 좌표
export const THEME_LOCATIONS = {
  SEA: {
    lat: 35.2213221,
    lng: 129.1614972,
  },
  RIVERSIDE: {
    lat: 35.1617158,
    lng: 128.9885509,
  },
  MOUNTAIN: {
    lat: 35.1800626,
    lng: 129.0745963,
  },
  DOWNTOWN: {
    lat: 35.1269695,
    lng: 129.0483013,
  },
} as const;