import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useReviews } from '@/hooks/useReviews';
import { getStarData } from '@/utils/starRating';
import { formatDate } from '@/utils/dateFormat';
import type { ReviewData } from '@/types/review';

import ReviewItem from './ReviewItem';
import StarFilledIconSrc from '@/assets/icons/star-filled.svg';
import StarHalfIconSrc from '@/assets/icons/star-half.svg';
import StarIconSrc from '@/assets/icons/star-default.svg';

interface ReviewListProps {
  courseId: number;
  reviewData?: ReviewData | null;
  skipQuery?: boolean;
}

const ReviewList = ({ courseId, reviewData: propReviewData, skipQuery = false }: ReviewListProps) => {
  const {
    reviewData: hookReviewData,
    editReviewAsync,
    deleteReviewAsync,
  } = useReviews({
    courseId,
    skipQuery: skipQuery || !!propReviewData,
  });

  // props로 받은 데이터가 있으면 우선 사용, 없으면 hook 데이터 사용
  const reviewData = propReviewData || hookReviewData;

  const handleEditReview = async (reviewId: number, stars?: number, contents?: string) => {
    await editReviewAsync({ reviewId, stars, contents });
  };

  const handleDeleteReview = async (reviewId: number) => {
    await deleteReviewAsync({ reviewId });
  };

  const renderStars = (rating: number) => {
    const starData = getStarData(rating);
    return starData.map(star => {
      let starSrc = StarIconSrc;
      if (star.type === 'filled') {
        starSrc = StarFilledIconSrc;
      } else if (star.type === 'half') {
        starSrc = StarHalfIconSrc;
      }

      return <img key={star.key} src={starSrc} alt={`${star.type}-star`} width={15} height={14} />;
    });
  };

  if (!reviewData || reviewData.reviewCount === 0) {
    return null;
  }

  return (
    <Container>
      <ReviewInfoWrapper>
        <ReviewInfo>
          <AverageRating>{reviewData.starAverage.toFixed(1)}</AverageRating>
          <TotalReview>({reviewData.reviewCount})</TotalReview>
        </ReviewInfo>
        <RatingWrapper>{renderStars(reviewData.starAverage)}</RatingWrapper>
      </ReviewInfoWrapper>
      {reviewData.reviewInfoDtos.map(item => (
        <ReviewItem
          key={item.reviewId}
          reviewId={item.reviewId}
          nickname={item.writerNickname}
          rating={item.stars}
          date={formatDate(item.createdAt)}
          review={item.contents}
          isMyReview={item.isMyReview}
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
        />
      ))}
    </Container>
  );
};

export default ReviewList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReviewInfoWrapper = styled.div`
  display: flex;
  padding: var(--spacing-12) 0;
  gap: var(--spacing-4);
`;

const ReviewInfo = styled.div`
  display: flex;
`;

const AverageRating = styled.div`
  ${theme.typography.subtitle3};
  color: var(--text-text-title, #1c1c1c);
`;

const TotalReview = styled.div`
  ${theme.typography.body1};
  color: var(--text-text-secondary, #555555);
`;

const RatingWrapper = styled.div`
  display: flex;
  gap: 2px;
`;
