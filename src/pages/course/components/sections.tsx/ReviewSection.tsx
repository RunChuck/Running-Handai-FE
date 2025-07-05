import styled from '@emotion/styled';
import * as S from './Section.styled';
import { theme } from '@/styles/theme';

import StarIconSrc from '@/assets/icons/star-default.svg';

const ReviewSection = () => {
  return (
    <S.SectionContainer>
      <S.ContentContainer>
        <S.SectionTitle>리뷰</S.SectionTitle>
        <RatingContainer>
          <RatingText>코스의 첫번째 리뷰어가 되어주세요!</RatingText>
          <RatingIconWrapper>
            <img src={StarIconSrc} alt="star" />
            <img src={StarIconSrc} alt="star" />
            <img src={StarIconSrc} alt="star" />
            <img src={StarIconSrc} alt="star" />
            <img src={StarIconSrc} alt="star" />
          </RatingIconWrapper>
        </RatingContainer>
      </S.ContentContainer>
    </S.SectionContainer>
  );
};

export default ReviewSection;

const RatingContainer = styled.div`
  background-color: var(--surface-surface-highlight3, #f7f8fa);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  padding: var(--spacing-24);
  gap: var(--spacing-4);
`;

const RatingText = styled.span`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;

const RatingIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
`;
