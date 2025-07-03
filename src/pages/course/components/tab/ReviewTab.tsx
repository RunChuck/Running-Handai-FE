import type { CourseData } from '@/types/course';

interface ReviewTabProps {
  course: CourseData;
}

const ReviewTab = ({ course }: ReviewTabProps) => {
  return <div>ReviewTab {course.title}</div>;
};

export default ReviewTab;
