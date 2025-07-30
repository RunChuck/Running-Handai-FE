import type { CourseTabType, CourseDetailResponse } from '@/types/course';

import CourseSection from '../sections.tsx/CourseSection';
import ReviewSection from '../sections.tsx/ReviewSection';
import AttractionSection from '../sections.tsx/AttractionSection';
import styled from '@emotion/styled';

interface OverviewTabProps {
  onTabChange: (tabKey: CourseTabType) => void;
  courseDetail: CourseDetailResponse['data'];
}

const OverviewTab = ({ onTabChange, courseDetail }: OverviewTabProps) => {
  return (
    <Container>
      <CourseSection onTabChange={onTabChange} courseDetail={courseDetail} />
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
