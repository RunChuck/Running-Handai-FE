export const courseKeys = {
  all: ['courses'] as const,
  // 코스 목록 조회
  nearby: (lat: number, lon: number) => 
    [...courseKeys.all, 'list', { filter: 'NEARBY', lat, lon }] as const,
  area: (area: string, lat: number, lon: number) => 
    [...courseKeys.all, 'list', { filter: 'AREA', area, lat, lon }] as const,
  theme: (theme: string, lat: number, lon: number) => 
    [...courseKeys.all, 'list', { filter: 'THEME', theme, lat, lon }] as const,
  // 코스 상세 조회
  detail: (id: number) => [...courseKeys.all, 'detail', id] as const,
};

export const reviewKeys = {
  all: ['reviews'] as const,
  // 리뷰 목록 조회
  list: (courseId: number) => [...reviewKeys.all, 'list', courseId] as const,
};