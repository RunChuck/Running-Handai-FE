import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import ReviewItem from './ReviewItem';

import StarFilledIconSrc from '@/assets/icons/star-filled.svg';
// import StarHalfIconSrc from '@/assets/icons/star-half.svg';
// import StarIconSrc from '@/assets/icons/star-default.svg';

const mock_data = [
  {
    id: 1,
    nickname: '고양이최고',
    rating: 4.5,
    date: '2025.06.14',
    review:
      '바다 옆을 뛸 수 있어서 좋아요! 그런데 뱅뱅사거리 쯤 도로공사로 길이 좀 안좋네요 ㅠㅠ 그리고 근처 카페 coffee051 에서 커피 한 잔해도 좋을거같아요 뱅뱅 사거리 쯤 도로공사로 길이 좀 안좋네요 ㅠㅠ바다 옆을 뛸 수 있어서 좋아요! 그런데 뱅뱅사거리 쯤 도로공사로 길이 좀 안좋네요 ㅠㅠ 그리고 근처 카페 coffee051 에서 커피 한 잔해도 좋을거같아요 뱅뱅 사거리 쯤 도로공사로 길이 좀 안좋네요',
  },
  {
    id: 2,
    nickname: '고양이최고',
    rating: 4.5,
    date: '2025.06.14',
    review:
      '바다 옆을 뛸 수 있어서 좋아요! 그런데 뱅뱅사거리 쯤 도로공사로 길이 좀 안좋네요 ㅠㅠ 그리고 근처 카페 coffee051 에서 커피 한 잔해도 좋을거같아요 바다 옆을 뛸 수 있어서 좋아요! 그런데 뱅뱅사거리',
  },
];

const ReviewList = () => {
  return (
    <Container>
      <ReviewInfoWrapper>
        <ReviewInfo>
          <AverageRating>4.5</AverageRating>
          <TotalReview>(52)</TotalReview>
        </ReviewInfo>
        <RatingWrapper>
          <img src={StarFilledIconSrc} alt="star" width={15} height={14} />
          <img src={StarFilledIconSrc} alt="star" width={15} height={14} />
          <img src={StarFilledIconSrc} alt="star" width={15} height={14} />
          <img src={StarFilledIconSrc} alt="star" width={15} height={14} />
          <img src={StarFilledIconSrc} alt="star" width={15} height={14} />
        </RatingWrapper>
      </ReviewInfoWrapper>
      {mock_data.map(item => (
        <ReviewItem key={item.id} nickname={item.nickname} rating={item.rating} date={item.date} review={item.review} />
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
