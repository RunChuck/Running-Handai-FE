import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import * as S from './Section.styled';
import type { CourseTabType } from '@/types/course';

import StarRating from '@/components/StarRating';
import CommonModal from '@/components/CommonModal';
import ReviewModal from '@/components/ReviewModal';
import Button from '@/components/Button';
import ArrowIconSrc from '@/assets/icons/arrow-right-16px.svg';

interface ReviewSectionProps {
  onTabChange: (tabKey: CourseTabType) => void;
}
const ReviewSection = ({ onTabChange }: ReviewSectionProps) => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const checkAuthAndExecute = (callback: () => void): boolean => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return false;
    }
    callback();
    return true;
  };

  const handleReviewDetail = () => {
    onTabChange('reviews');
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleRatingChange = (newRating: number) => {
    checkAuthAndExecute(() => {
      setRating(newRating);
      setIsReviewModalOpen(true);
    });
  };

  return (
    <S.SectionContainer>
      <S.ContentContainer>
        <S.SectionTitle>{t('review')}</S.SectionTitle>
        <StarRating rating={rating} onRatingChange={handleRatingChange} label={t('courseDetail.firstReviewer')} />
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
        onClose={() => setIsReviewModalOpen(false)}
        onConfirm={(reviewText, reviewRating) => {
          console.log('Review submitted:', { reviewText, rating: reviewRating || rating });
          setIsReviewModalOpen(false);
        }}
        confirmText={t('modal.reviewModal.confirm')}
        mode="create"
        initialRating={rating}
      />
    </S.SectionContainer>
  );
};

export default ReviewSection;
