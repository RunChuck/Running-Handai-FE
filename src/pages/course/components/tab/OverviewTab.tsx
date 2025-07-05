import type { CourseMockData, CourseTabType } from '@/types/course';

import CourseSection from '../sections.tsx/CourseSection';
import ReviewSection from '../sections.tsx/ReviewSection';
import AttractionSection from '../sections.tsx/AttractionSection';
import styled from '@emotion/styled';

interface OverviewTabProps {
  onTabChange: (tabKey: CourseTabType) => void;
  course: CourseMockData;
}

const OverviewTab = ({ onTabChange, course }: OverviewTabProps) => {
  return (
    <Container>
      <CourseSection onTabChange={onTabChange} course={course} />
      <SectionDivider />
      <AttractionSection onTabChange={onTabChange} />
      <SectionDivider />
      <ReviewSection />
    </Container>
  );
};

export default OverviewTab;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionDivider = styled.div`
  width: 100%;
  height: 10px;
  background-color: var(--surface-surface-highlight, #f4f4f4);
`;
