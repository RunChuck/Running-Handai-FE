import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useAuth } from '@/hooks/useAuth';

import StarRating from '@/components/StarRating';
import CommonModal from '@/components/CommonModal';
import ReviewModal from '@/components/ReviewModal';
import ReviewList from '@/components/ReviewList';

const ReviewTab = () => {
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
    <Container>
      <StarRating rating={rating} onRatingChange={handleRatingChange} label={t('courseDetail.firstReviewer')} />
      <ReviewList />

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
    </Container>
  );
};

export default ReviewTab;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-24) var(--spacing-16);
`;

