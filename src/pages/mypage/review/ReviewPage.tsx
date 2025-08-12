import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import MyReviewItem from './MyReviewItem';
import Header from '../components/Header';
import NoReviewIconSrc from '@/assets/icons/no-review.svg';

const ReviewPage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  // 테스트용
  const reviewCount = 1;

  return (
    <Container>
      <Header title={t('mypage.review.title')} onBack={() => navigate(-1)} />
      {reviewCount > 0 ? (
        <>
          <MyReviewItem />
          <SectionDevider />
          <MyReviewItem />
          <SectionDevider />
          <MyReviewItem />
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
`;

const SectionDevider = styled.div`
  width: 100%;
  height: 10px;
  background-color: var(--surface-surface-highlight, #f4f4f4);
`;
