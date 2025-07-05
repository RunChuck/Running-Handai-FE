import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { CourseData } from '@/types/course';
import useScrollToTop from '@/hooks/useScrollToTop';

import Header from './components/Header';
import Tabs from './components/Tabs';
import ScrollIconSrc from '@/assets/icons/scroll-up.svg';

interface LocationState {
  course: CourseData;
}

const CourseDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { scrollRef, scrollToTop, showScrollButton } = useScrollToTop();
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
    <Container ref={scrollRef}>
      <Header
        title={course.title}
        isBookmarked={course.isBookmarked}
        onBack={handleBack}
        onShare={handleShare}
        onBookmarkToggle={handleBookmarkToggle}
      />
      <CourseThumbnail src={course.thumbnail} alt="thumbnail" />
      <Tabs course={course} />
      {showScrollButton && (
        <ScrollButtonContainer>
          <ScrollButton onClick={scrollToTop}>
            <img src={ScrollIconSrc} alt="scroll" />
          </ScrollButton>
          <ScrollToTop>맨 위로</ScrollToTop>
        </ScrollButtonContainer>
      )}
    </Container>
  );
};

export default CourseDetail;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const CourseThumbnail = styled.img`
  width: 100%;
  object-fit: cover;
  aspect-ratio: 1/1;
`;

const ScrollButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  padding: var(--spacing-32) 0 var(--spacing-16);
`;

const ScrollButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-1px);
  }
`;

const ScrollToTop = styled.span`
  ${theme.typography.body2};
  color: var(--GrayScale-gray500, #999999);
`;
