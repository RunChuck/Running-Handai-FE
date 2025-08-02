/**
 * 마우스/터치 위치를 기반으로 별점을 계산
 * @param clientX - 마우스/터치의 X 좌표
 * @param containerRect - 별점 컨테이너의 DOMRect
 * @param maxRating - 최대 별점 (기본값: 5)
 * @returns 0.5 단위의 별점 (0 ~ maxRating 범위)
 */
export const calculateRatingFromPosition = (clientX: number, containerRect: DOMRect, maxRating: number = 5): number => {
  const relativeX = clientX - containerRect.left;
  const totalWidth = containerRect.width;
  const starWidth = totalWidth / maxRating;

  const starIndex = Math.floor(relativeX / starWidth);
  const positionInStar = (relativeX % starWidth) / starWidth;
  const isLeftHalf = positionInStar < 0.5;

  const newRating = Math.max(0, Math.min(maxRating, starIndex + (isLeftHalf ? 0.5 : 1)));
  return newRating;
};

export type StarType = 'filled' | 'half' | 'empty';

export interface StarData {
  type: StarType;
  key: number;
}

/**
 * 별점을 렌더링에 필요한 데이터 배열로 변환
 * @param rating - 표시할 별점 (0-5)
 * @returns 별 데이터 배열
 */
export const getStarData = (rating: number): StarData[] => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 > 0;
  const stars: StarData[] = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push({ type: 'filled', key: i });
    } else if (i === fullStars && hasHalfStar) {
      stars.push({ type: 'half', key: i });
    } else {
      stars.push({ type: 'empty', key: i });
    }
  }
  return stars;
};
