import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReviews } from '@/hooks/useReviews';
import * as S from './Section.styled';
import type { CourseTabType } from '@/types/course';
import type { ReviewData } from '@/types/review';

import StarRating from '@/components/StarRating';
import CommonModal from '@/components/CommonModal';
import ReviewModal from '@/components/ReviewModal';
import ReviewList from '@/components/ReviewList';
import Button from '@/components/Button';
import ArrowIconSrc from '@/assets/icons/arrow-right-16px.svg';

interface ReviewSectionProps {
  onTabChange: (tabKey: CourseTabType) => void;
  reviewData: ReviewData | null;
  courseId: number;
}
const ReviewSection = ({ onTabChange, reviewData, courseId }: ReviewSectionProps) => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  const {
    rating,
    isReviewModalOpen,
    isLoginModalOpen,
    isCreating,
    handleRatingChange,
    handleReviewSubmit,
    handleLoginModalClose,
    handleReviewModalClose,
  } = useReviews({ courseId, skipQuery: true });

  const handleReviewDetail = () => {
    onTabChange('reviews');
  };

  const getStarRatingLabel = () => {
    if (!reviewData || reviewData.reviewCount === 0) {
      return t('courseDetail.firstReviewer');
    }
    const hasMyReview = reviewData.reviewInfoDtos.some(review => review.isMyReview);
    if (hasMyReview) {
      return null;
    }
    return t('courseDetail.reviewRating');
  };

  const starRatingLabel = getStarRatingLabel();

  return (
    <S.SectionContainer>
      <S.ContentContainer>
        <S.SectionTitle>{t('review')}</S.SectionTitle>
        {starRatingLabel && <StarRating rating={rating} onRatingChange={handleRatingChange} label={starRatingLabel} />}

        <ReviewList courseId={courseId} reviewData={reviewData} skipQuery={true} />
      </S.ContentContainer>

      <Button
        backgroundColor="var(--bg-background-primary, #fff)"
        border="1px solid var(--line-line-002, #e0e0e0)"
        borderRadius="24px"
        fullWidth
        customTypography={true}
        onClick={handleReviewDetail}
      >
        <S.ButtonText>{t('courseDetail.moreReview')}</S.ButtonText>
        <img src={ArrowIconSrc} alt="arrow" />
      </Button>

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
    </S.SectionContainer>
  );
};

export default ReviewSection;
