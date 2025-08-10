import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import TempThumbnailImgSrc from '@/assets/images/temp-courseCard.png';
import MoreIconSrc from '@/assets/icons/more-24px.svg';
import DistanceIconSrc from '@/assets/icons/course-distance.svg';
import TimeIconSrc from '@/assets/icons/course-time.svg';
import AltitudeIconSrc from '@/assets/icons/course-max-altitude.svg';

const courseInfoItems = [
  {
    icon: DistanceIconSrc,
    alt: 'distance',
    label: '8.7km',
  },
  {
    icon: TimeIconSrc,
    alt: 'time',
    label: '50분',
  },
  {
    icon: AltitudeIconSrc,
    alt: 'altitude',
    label: '20m',
  },
];

const MyCourseCard = () => {
  const handleCardClick = () => {
    console.log('card clicked');
  };

  const handleMoreButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('more button clicked');
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <ThumbnailWrapper>
        <img src={TempThumbnailImgSrc} />
      </ThumbnailWrapper>
      <CourseInfoCard>
        <RowRapper>
          <CreatedDate>2025.01.01</CreatedDate>
          <MoreButton onClick={handleMoreButtonClick}>
            <img src={MoreIconSrc} width={20} height={20} />
          </MoreButton>
        </RowRapper>
        <CourseName>부산에 놀러갔다가 러닝코스를 그려보고 싶어서 그려본 러닝코스</CourseName>
        <CourseInfoWrapper>
          {courseInfoItems.map((item, index) => (
            <CourseInfoItemGroup key={index}>
              <CourseInfoItem>
                <img src={item.icon} alt={item.alt} />
                <span>{item.label}</span>
              </CourseInfoItem>
              {index < courseInfoItems.length - 1 && <Divider />}
            </CourseInfoItemGroup>
          ))}
        </CourseInfoWrapper>
      </CourseInfoCard>
    </CardContainer>
  );
};

export default MyCourseCard;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 240px;
  min-height: 240px;
  border-radius: 8px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  cursor: pointer;
`;

const ThumbnailWrapper = styled.div`
  width: 240px;
  height: 135px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contains;
    aspect-ratio: 16/9;
  }
`;

const CourseInfoCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-16);
  gap: var(--spacing-4);
`;

const RowRapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreatedDate = styled.span`
  ${theme.typography.caption3};
  color: var(--text-text-disabled, #bbbbbb);
`;

const MoreButton = styled.button`
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--surface-surface-highlight, #f4f4f4);
  }
`;

const CourseName = styled.span`
  ${theme.typography.subtitle3};
  color: var(--text-text-title, #1c1c1c);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const CourseInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
`;

const CourseInfoItemGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
`;

const CourseInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);

  ${theme.typography.caption1};
  color: var(--text-text-title, #1c1c1c);
  white-space: nowrap;
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background-color: var(--line-line-002, #e0e0e0);
`;
