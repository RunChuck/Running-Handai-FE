import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import StarFilledIconSrc from '@/assets/icons/star-filled.svg';
// import StarHalfIconSrc from '@/assets/icons/star-half.svg';
// import StarIconSrc from '@/assets/icons/star-default.svg';

interface ReviewItemProps {
  nickname: string;
  rating: number;
  date: string;
  review: string;
}

const ReviewItem = ({ nickname, rating, date, review }: ReviewItemProps) => {
  const [t] = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  const checkTextOverflow = (element: HTMLDivElement | null) => {
    if (element) {
      setNeedsTruncation(element.scrollHeight > element.clientHeight);
    }
  };

  return (
    <Container>
      <UserNickname>{nickname}</UserNickname>
      <RatingWrapper>
        <Rating>
          <img src={StarFilledIconSrc} alt="star" width={12} height={12} />
          {rating}
        </Rating>
        <Divider />
        <Date>{date}</Date>
      </RatingWrapper>
      <ReviewWrapper>
        {isExpanded ? (
          <>
            <Review>{review}</Review>
            <ToggleButton onClick={() => setIsExpanded(false)}>{t('courseDetail.collapse')}</ToggleButton>
          </>
        ) : (
          <ReviewTruncated>
            <Review ref={checkTextOverflow}>{review}</Review>
            {needsTruncation && <ToggleButtonInline onClick={() => setIsExpanded(true)}>{t('courseDetail.moreReviews')}</ToggleButtonInline>}
          </ReviewTruncated>
        )}
      </ReviewWrapper>
    </Container>
  );
};

export default ReviewItem;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-12) 0;
  gap: var(--spacing-4);
  border-top: 1px solid var(--line-line-001, #eeeeee);
`;

const UserNickname = styled.span`
  ${theme.typography.subtitle3};
  color: var(--text-text-title, #1c1c1c);
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  ${theme.typography.body2};
  color: var(--text-text-title, #1c1c1c);
`;

const Divider = styled.div`
  width: 1px;
  height: 10px;
  background: var(--line-line-001, #eeeeee);
`;

const Date = styled.span`
  ${theme.typography.body2};
  color: var(--GrayScale-gray500, #999999);
`;

const ReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ReviewTruncated = styled.div`
  position: relative;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Review = styled.div`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;

const ToggleButton = styled.button`
  ${theme.typography.caption1};
  color: var(--text-text-disabled, #bbbbbb);
  align-self: flex-start;
  padding: 0;
  margin-top: 4px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ToggleButtonInline = styled.button`
  ${theme.typography.caption1};
  color: var(--text-text-disabled, #bbbbbb);
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  padding-left: 2px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
