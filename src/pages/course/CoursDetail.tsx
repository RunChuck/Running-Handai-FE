import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import type { CourseData } from '@/types/course';

import Header from './components/Header';
import Tabs from './components/Tabs';

interface LocationState {
  course: CourseData;
}

const CourseDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | null;
  const course = state?.course;

  useEffect(() => {
    if (!course) {
      navigate('/main', { replace: true });
    }
  }, [course, navigate]);

  if (!course) {
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    // TODO: 공유하기
  };

  const handleBookmarkToggle = () => {
    // TODO: 북마크 기능
  };

  return (
    <Container>
      <Header
        title={course.title}
        isBookmarked={course.isBookmarked}
        onBack={handleBack}
        onShare={handleShare}
        onBookmarkToggle={handleBookmarkToggle}
      />
      <CourseThumbnail src={course.thumbnail} alt="thumbnail" />
      <Tabs course={course} />
    </Container>
  );
};

export default CourseDetail;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const CourseThumbnail = styled.img`
  width: 100%;
  object-fit: cover;
  aspect-ratio: 1/1;
`;
