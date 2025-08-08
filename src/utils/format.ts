// 숫자를 소수점 둘째자리까지 표시 (정수면 그대로)
export const formatDecimal = (value: number): string => {
  return value % 1 === 0 ? value.toString() : value.toFixed(2);
};

// 코스 정보 매핑
export const mapCourseInfo = (courseData: { distance: number; duration: number; maxElevation: number; minElevation: number; level: string }) => {
  return {
    distance: courseData.distance,
    duration: courseData.duration,
    maxElevation: courseData.maxElevation,
    minElevation: courseData.minElevation,
    level: courseData.level,
  };
};
