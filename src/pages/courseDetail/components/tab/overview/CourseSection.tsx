import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import * as S from './Section.styled';
import { theme } from '@/styles/theme';
import type { CourseTabType, CourseDetailResponse } from '@/types/course';

import Button from '@/components/Button';
import DistanceIconSrc from '@/assets/icons/course-distance.svg';
import TimeIconSrc from '@/assets/icons/course-time.svg';
import AltitudeIconSrc from '@/assets/icons/course-max-altitude.svg';
import ArrowIconSrc from '@/assets/icons/arrow-down-16px.svg';

interface CourseSectionProps {
  onTabChange: (tabKey: CourseTabType) => void;
  courseDetail: CourseDetailResponse['data'];
}

const CourseSection = ({ onTabChange, courseDetail }: CourseSectionProps) => {
  const [t] = useTranslation();

  const handleCourseDetail = () => {
    onTabChange('course');
  };

  const courseInfoItems = [
    {
      icon: DistanceIconSrc,
      alt: 'distance',
      label: `${courseDetail.distance % 1 === 0 ? courseDetail.distance : courseDetail.distance.toFixed(2)}km`,
    },
    {
      icon: TimeIconSrc,
      alt: 'time',
      label: `${courseDetail.duration}${t('minutes')}`,
    },
    {
      icon: AltitudeIconSrc,
      alt: 'altitude',
      label: `${t('max')}${courseDetail.maxElevation % 1 === 0 ? courseDetail.maxElevation : courseDetail.maxElevation.toFixed(2)}m`,
    },
  ];

  return (
    <S.SectionContainer>
      <S.ContentContainer>
        <S.SectionTitle>{t('course')}</S.SectionTitle>
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
      </S.ContentContainer>
      <Button
        backgroundColor="var(--bg-background-primary, #fff)"
        border="1px solid var(--line-line-002, #e0e0e0)"
        borderRadius="24px"
        fullWidth
        customTypography={true}
        onClick={handleCourseDetail}
      >
        <S.ButtonText>{t('courseDetail.moreCourseInfo')}</S.ButtonText>
        <img src={ArrowIconSrc} alt="arrow" />
      </Button>
    </S.SectionContainer>
  );
};

export default CourseSection;

const CourseInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-surface-highlight3, #f7f8fa);
  gap: var(--spacing-12);
  padding: var(--spacing-12);
  border-radius: 4px;
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
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background-color: var(--line-line-002, #e0e0e0);
`;
