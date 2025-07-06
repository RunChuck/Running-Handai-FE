import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import * as S from '@/pages/main/Main.styled';
import useScrollToTop from '@/hooks/useScrollToTop';
import { useCourseDetail } from '@/hooks/useCourseDetail';

import Header from './components/Header';
import Tabs from './components/Tabs';
import ScrollIconSrc from '@/assets/icons/scroll-up.svg';
import TempThumbnailImgSrc from '@/assets/images/temp-thumbnail.png';

const CourseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { scrollRef, scrollToTop, showScrollButton } = useScrollToTop();

  const courseId = parseInt(id || '0', 10);
  const { courseDetail, loading, error } = useCourseDetail(courseId);

  useEffect(() => {
    if (!courseId) {
      navigate('/main', { replace: true });
    }
  }, [courseId, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    // TODO: 공유하기
  };

  const handleBookmarkToggle = () => {
    // TODO: 북마크 기능
  };

  if (loading) {
    return (
      <Container>
        <S.StatusContainer>
          <S.StatusText>코스 정보를 불러오는 중...🏃‍♂️</S.StatusText>
        </S.StatusContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <S.StatusContainer>
          <S.StatusText>{error}</S.StatusText>
          <S.RetryButton onClick={() => window.location.reload()}>다시 시도</S.RetryButton>
        </S.StatusContainer>
      </Container>
    );
  }

  if (!courseDetail) {
    return null;
  }

  const title = `코스 ${courseDetail.courseId}`;

  return (
    <Container ref={scrollRef}>
      <Header
        title={title}
        isBookmarked={false} // TODO: 북마크 상태 연결
        onBack={handleBack}
        onShare={handleShare}
        onBookmarkToggle={handleBookmarkToggle}
      />
      <CourseThumbnail src={TempThumbnailImgSrc} alt="코스 썸네일" />
      <Tabs courseDetail={courseDetail} />
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
