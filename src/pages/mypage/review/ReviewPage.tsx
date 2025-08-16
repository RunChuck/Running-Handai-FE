import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useMyReviews } from '@/hooks/useMyReviews';

import MyReviewItem from './MyReviewItem';
import Header from '../components/Header';
import NoReviewIconSrc from '@/assets/icons/no-review.svg';
import LoadingMotion from '@/assets/animations/run-loading.json';

const ReviewPage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { data: reviewsData, isLoading, error } = useMyReviews();
  const reviews = reviewsData?.data || [];

  if (isLoading) {
    return (
      <Container>
        <Header title={t('mypage.review.title')} onBack={() => navigate(-1)} />
        <StatusContainer>
          <Lottie animationData={LoadingMotion} style={{ width: 100, height: 100 }} loop={true} />
        </StatusContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header title={t('mypage.review.title')} onBack={() => navigate(-1)} />
        <EmptyContent>
          <EmptyContentContainer>
            <img src={NoReviewIconSrc} />
            <EmptyContentText>{t('mypage.review.error')}</EmptyContentText>
          </EmptyContentContainer>
        </EmptyContent>
      </Container>
    );
  }

  return (
    <Container>
      <Header title={t('mypage.review.title')} onBack={() => navigate(-1)} />
      {reviews.length > 0 ? (
        <>
          {reviews.map((review, index) => (
            <div key={review.reviewId}>
              <MyReviewItem review={review} />
              {index < reviews.length - 1 && <SectionDevider />}
            </div>
          ))}
        </>
      ) : (
        <EmptyContent>
          <EmptyContentContainer>
            <img src={NoReviewIconSrc} />
            <EmptyContentText>{t('mypage.review.empty')}</EmptyContentText>
          </EmptyContentContainer>
        </EmptyContent>
      )}
    </Container>
  );
};

export default ReviewPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 32px;
`;

const EmptyContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 44px 16px;
`;

const EmptyContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-16);
  width: 100%;
  height: 185px;
  background-color: var(--surface-surface-highlight3, #f7f8fa);
  border-radius: 8px;
`;

const EmptyContentText = styled.div`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
  white-space: pre-line;
  text-align: center;
`;

const SectionDevider = styled.div`
  width: 100%;
  height: 10px;
  background-color: var(--surface-surface-highlight, #f4f4f4);
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 44px 16px;
`;