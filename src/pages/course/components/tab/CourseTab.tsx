import type { CourseData } from '@/types/course';

interface CourseTabProps {
  course: CourseData;
}

const CourseTab = ({ course }: CourseTabProps) => {
  return <div>CourseTab {course.title}</div>;
};

export default CourseTab;
