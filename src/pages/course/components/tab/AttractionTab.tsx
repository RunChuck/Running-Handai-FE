import type { CourseData } from '@/types/course';

interface AttractionTabProps {
  course: CourseData;
}

const AttractionTab = ({ course }: AttractionTabProps) => {
  return <div>AttractionTab {course.title}</div>;
};

export default AttractionTab;
