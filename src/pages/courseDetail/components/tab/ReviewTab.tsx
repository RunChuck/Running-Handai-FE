import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useReviews } from '@/hooks/useReviews';

import StarRating from '@/components/StarRating';
import CommonModal from '@/components/CommonModal';
import ReviewModal from '@/components/ReviewModal';
import ReviewList from '@/components/ReviewList';

interface ReviewTabProps {
  courseId: number;
}

const ReviewTab = ({ courseId }: ReviewTabProps) => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  
  const {
    reviewData,
    rating,
    isReviewModalOpen,
    isLoginModalOpen,
    isCreating,
    handleRatingChange,
    handleReviewSubmit,
    handleLoginModalClose,
    handleReviewModalClose,
  } = useReviews({ courseId });

  const getStarRatingLabel = () => {
    if (!reviewData || reviewData.reviewCount === 0) {
      return t('courseDetail.firstReviewer');
    }
    const hasMyReview = reviewData.reviewInfoDtos.some(review => review.isMyReview);
    if (hasMyReview) {
      return null;
    }
    return t('courseDetail.reviewRating'); // 리뷰가 있지만 내가 작성 X
  };

  const starRatingLabel = getStarRatingLabel();

  return (
    <Container>
      {starRatingLabel && <StarRating rating={rating} onRatingChange={handleRatingChange} label={starRatingLabel} />}
      <ReviewList courseId={courseId} />

      <CommonModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onConfirm={() => navigate('/')}
        content={t('modal.reviewModal.loginMessage')}
        cancelText={t('cancel')}
        confirmText={t('main.simpleLogin')}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleReviewModalClose}
        onConfirm={handleReviewSubmit}
        confirmText={isCreating ? t('modal.reviewModal.submitting') : t('modal.reviewModal.confirm')}
        mode="create"
        initialRating={rating}
      />
    </Container>
  );
};

export default ReviewTab;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-24) var(--spacing-16);
`;

