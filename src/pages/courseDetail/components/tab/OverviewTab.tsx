import styled from '@emotion/styled';
import type { CourseTabType, CourseDetailResponse } from '@/types/course';
import type { ReviewData } from '@/types/review';
import { useCourseSummary } from '@/hooks/useCourseSummary';

import CourseSection from './overview/CourseSection';
import ReviewSection from './overview/ReviewSection';
import AttractionSection from './overview/AttractionSection';

interface OverviewTabProps {
  onTabChange: (tabKey: CourseTabType) => void;
  courseDetail: CourseDetailResponse['data'];
  courseId: number;
}

const OverviewTab = ({ onTabChange, courseDetail, courseId }: OverviewTabProps) => {
  const { summary, loading, error } = useCourseSummary(courseId);

  const reviewData: ReviewData | null = summary
    ? {
        reviewInfoDtos: summary.reviews,
        reviewCount: summary.reviewCount,
        starAverage: summary.starAverage,
      }
    : null;

  return (
    <Container>
      <CourseSection onTabChange={onTabChange} courseDetail={courseDetail} />
      <SectionDivider />
      <AttractionSection
        onTabChange={onTabChange}
        spots={summary?.spots || []}
        spotStatus={summary?.spotStatus || 'COMPLETED'}
        loading={loading}
        error={error}
      />
      <SectionDivider />
      <ReviewSection onTabChange={onTabChange} reviewData={reviewData} courseId={courseId} />
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
