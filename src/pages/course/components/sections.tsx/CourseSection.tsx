import styled from '@emotion/styled';
import * as S from './Section.styled';
import { theme } from '@/styles/theme';
import type { CourseTabType, CourseMockData } from '@/types/course';

import Button from '@/components/Button';
import DistanceIconSrc from '@/assets/icons/course-distance.svg';
import TimeIconSrc from '@/assets/icons/course-time.svg';
import AltitudeIconSrc from '@/assets/icons/course-max-altitude.svg';
import ArrowIconSrc from '@/assets/icons/arrow-down-16px.svg';

interface CourseSectionProps {
  onTabChange: (tabKey: CourseTabType) => void;
  course: CourseMockData;
}

const CourseSection = ({ onTabChange, course }: CourseSectionProps) => {
  const handleCourseDetail = () => {
    onTabChange('course');
  };

  return (
    <S.SectionContainer>
      <S.ContentContainer>
        <S.SectionTitle>코스</S.SectionTitle>
        <CourseInfoWrapper>
          <CourseInfoItem>
            <img src={DistanceIconSrc} alt="distance" />
            <span>{course.distance}</span>
          </CourseInfoItem>
          <Divider />
          <CourseInfoItem>
            <img src={TimeIconSrc} alt="time" />
            <span>{course.duration}</span>
          </CourseInfoItem>
          <Divider />
          <CourseInfoItem>
            <img src={AltitudeIconSrc} alt="altitude" />
            <span>{course.elevation}</span>
          </CourseInfoItem>
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
        <S.ButtonText>코스 정보 더보기</S.ButtonText>
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
