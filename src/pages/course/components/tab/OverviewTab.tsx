import type { CourseData } from '@/types/course';

interface OverviewTabProps {
  course: CourseData;
}

const OverviewTab = ({ course }: OverviewTabProps) => {
  return <div>OverviewContent {course.title}</div>;
};

export default OverviewTab;
