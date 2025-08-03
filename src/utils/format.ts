// 숫자를 소수점 둘째자리까지 표시 (정수면 그대로)
export const formatDecimal = (value: number): string => {
  return value % 1 === 0 ? value.toString() : value.toFixed(2);
};

// 코스 정보 포맷팅
export const formatCourseInfo = (courseData: { distance: number; duration: number; maxElevation: number; minElevation: number; level: string }) => {
  return {
    distance: formatDecimal(courseData.distance),
    duration: courseData.duration,
    maxElevation: formatDecimal(courseData.maxElevation),
    minElevation: formatDecimal(courseData.minElevation),
    level: courseData.level,
  };
};
