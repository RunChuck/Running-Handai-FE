import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import * as S from '@/pages/course/Course.styled';
import useScrollToTop from '@/hooks/useScrollToTop';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import { useBookmark } from '@/hooks/useBookmark';

import Header from './components/Header';
import Tabs from './components/Tabs';
import CourseRouteMap from '@/components/CourseRouteMap';
import CommonModal from '@/components/CommonModal';
import ScrollIconSrc from '@/assets/icons/scroll-up.svg';
import LoadingMotion from '@/assets/animations/run-loading.json';
import NoCourseImgSrc from '@/assets/images/sad-emoji.png';

const CourseDetail = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { scrollRef, scrollToTop, showScrollButton } = useScrollToTop();

  const courseId = parseInt(id || '0', 10);
  const { courseDetail, loading, error, setCourseDetail } = useCourseDetail(courseId);
  const { handleBookmark } = useBookmark({
    onUpdateCourse: (_, updates) => {
      if (courseDetail) {
        setCourseDetail({
          ...courseDetail,
          isBookmarked: updates.isBookmarked,
          bookmarks: updates.bookmarks,
        });
      }
    },
    onUnauthenticated: () => {
      setIsLoginModalOpen(true);
    },
  });

  useEffect(() => {
    if (!courseId) {
      navigate('/course', { replace: true });
    }
  }, [courseId, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    // TODO: 공유하기
  };

  const handleBookmarkToggle = () => {
    if (courseDetail) {
      handleBookmark(courseDetail);
    }
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  if (loading) {
    return (
      <Container>
        <StatusContainer>
          <Lottie animationData={LoadingMotion} style={{ width: 100, height: 100 }} loop={true} />
          <S.StatusText>{t('courseDetail.loading')}</S.StatusText>
        </StatusContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <StatusContainer>
          <img src={NoCourseImgSrc} alt={t('courseDetail.error')} width={57} height={60} />
          <S.StatusText>{error}</S.StatusText>
          <S.RetryButton onClick={() => window.location.reload()}>{t('courseDetail.retry')}</S.RetryButton>
        </StatusContainer>
      </Container>
    );
  }

  if (!courseDetail) {
    return null;
  }

  const title = `${t('course')} ${courseDetail.courseId}`;

  return (
    <Container ref={scrollRef}>
      <Header
        title={title}
        isBookmarked={courseDetail.isBookmarked}
        onBack={handleBack}
        onShare={handleShare}
        onBookmarkToggle={handleBookmarkToggle}
      />
      <CourseRouteMap courseDetail={courseDetail} />
      <Tabs courseDetail={courseDetail} />
      {showScrollButton && (
        <ScrollButtonContainer>
          <ScrollButton onClick={scrollToTop}>
            <img src={ScrollIconSrc} alt="scroll" />
          </ScrollButton>
          <ScrollToTop>{t('courseDetail.scrollToTop')}</ScrollToTop>
        </ScrollButtonContainer>
      )}

      <CommonModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onConfirm={() => navigate('/')}
        content={t('main.loginMessage')}
        cancelText={t('cancel')}
        confirmText={t('main.simpleLogin')}
      />
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

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-12);
  height: 100%;
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
