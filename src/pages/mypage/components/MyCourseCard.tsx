import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import { Dropdown, DropdownItem } from '@/components/Dropdown';
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

interface MyCourseCardProps {
  variant?: 'mypage' | 'grid';
}

const MyCourseCard = ({ variant = 'mypage' }: MyCourseCardProps) => {
  const [t] = useTranslation();

  const handleCardClick = () => {
    console.log('card clicked');
  };

  const handleEditClick = () => {
    console.log('edit clicked');
  };

  const handleDeleteClick = () => {
    console.log('delete clicked');
  };

  return (
    <CardContainer $variant={variant} onClick={handleCardClick}>
      <ThumbnailWrapper $variant={variant}>
        <img src={TempThumbnailImgSrc} />
      </ThumbnailWrapper>
      <CourseInfoCard $variant={variant}>
        <RowRapper>
          <CreatedDate $variant={variant}>2025.01.01</CreatedDate>
          <Dropdown trigger={<img src={MoreIconSrc} alt="more" width={20} height={20} />} width={80} padding="0">
            <DropdownItem onClick={handleEditClick}>{t('edit')}</DropdownItem>
            <DropdownItem onClick={handleDeleteClick} variant="danger">
              {t('delete')}
            </DropdownItem>
          </Dropdown>
        </RowRapper>
        <CourseName $variant={variant}>부산에 놀러갔다가 러닝코스를 그려보고 싶어서 그려본 러닝코스</CourseName>
        <CourseInfoWrapper $variant={variant}>
          {courseInfoItems.map((item, index) => (
            <CourseInfoItemGroup key={index} $variant={variant}>
              <CourseInfoItem $variant={variant}>
                <CourseInfoIcon src={item.icon} alt={item.alt} $variant={variant} />
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

const CardContainer = styled.div<{ $variant: 'mypage' | 'grid' }>`
  display: flex;
  flex-direction: column;
  width: ${({ $variant }) => ($variant === 'grid' ? '272px' : '240px')};
  min-width: ${({ $variant }) => ($variant === 'mypage' ? '240px' : 'unset')};
  min-height: ${({ $variant }) => ($variant === 'mypage' ? '240px' : 'unset')};
  border-radius: 8px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  cursor: pointer;

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      width: 100%;
    }
  `}
`;

const ThumbnailWrapper = styled.div<{ $variant: 'mypage' | 'grid' }>`
  width: 100%;
  height: ${({ $variant }) => ($variant === 'grid' ? '153px' : '135px')};
  overflow: hidden;

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      height: auto;
      aspect-ratio: 16/9;
    }
  `}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 16/9;
  }
`;

const CourseInfoCard = styled.div<{ $variant: 'mypage' | 'grid' }>`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-16);
  gap: var(--spacing-4);

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      padding: var(--spacing-8);
    }
  `}
`;

const RowRapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreatedDate = styled.span<{ $variant: 'mypage' | 'grid' }>`
  ${theme.typography.caption3};
  color: var(--text-text-disabled, #bbbbbb);

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      ${theme.typography.label2};
    }
  `}
`;

const CourseName = styled.span<{ $variant: 'mypage' | 'grid' }>`
  ${theme.typography.subtitle3};
  color: var(--text-text-title, #1c1c1c);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      ${theme.typography.caption2};
    }
  `}
`;

const CourseInfoWrapper = styled.div<{ $variant: 'mypage' | 'grid' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-12);

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      gap: var(--spacing-8);
    }
  `}
`;

const CourseInfoItemGroup = styled.div<{ $variant: 'mypage' | 'grid' }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      gap: var(--spacing-8);
    }
  `}
`;

const CourseInfoItem = styled.div<{ $variant: 'mypage' | 'grid' }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  ${theme.typography.caption1};
  color: var(--text-text-title, #1c1c1c);
  white-space: nowrap;

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      ${theme.typography.caption4};
    }
  `}
`;

const CourseInfoIcon = styled.img<{ $variant: 'mypage' | 'grid' }>`
  width: 16px;
  height: 16px;

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      width: 12px;
      height: 12px;
    }
  `}
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background-color: var(--line-line-002, #e0e0e0);
`;
