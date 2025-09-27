import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Lottie from 'lottie-react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import * as S from '@/pages/course/Course.styled';
import useScrollToTop from '@/hooks/useScrollToTop';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import { useBookmark } from '@/hooks/useBookmark';
import { mapCourseInfo } from '@/utils/format';
import type { CourseData } from '@/types/course';

import Header from './components/Header';
import Tabs from './components/Tabs';
import CourseRouteMap from '@/components/CourseRouteMap';
import CommonModal from '@/components/CommonModal';
import MetaTags from '@/components/MetaTags';
import ScrollIconSrc from '@/assets/icons/scroll-up.svg';
import LoadingMotion from '@/assets/animations/run-loading.json';
import NoCourseImgSrc from '@/assets/images/sad-emoji.png';

const CourseDetail = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const queryClient = useQueryClient();

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

  const handleBookmarkToggle = () => {
    if (courseDetail) {
      handleBookmark(courseDetail);
    }
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const getThumbnailUrl = (): string => {
    // 1. Navigation state에서 먼저 확인 (마이페이지/즐겨찾기에서 진입)
    const courseFromState = location.state?.course;

    if (courseFromState?.thumbnailUrl) {
      if (courseFromState.thumbnailUrl.startsWith('/')) {
        return `${window.location.origin}${courseFromState.thumbnailUrl}`;
      }
      return courseFromState.thumbnailUrl;
    }

    // 2. 코스 목록에서 진입
    const courseQueries = queryClient.getQueryCache().findAll({ queryKey: ['courses'] });

    for (const query of courseQueries) {
      const courseData = query.state.data as { data: CourseData[] } | undefined;
      if (courseData?.data) {
        const course = courseData.data.find((c: CourseData) => c.courseId === courseId);
        if (course?.thumbnailUrl) {
          if (course.thumbnailUrl.startsWith('/')) {
            return `${window.location.origin}${course.thumbnailUrl}`;
          }
          return course.thumbnailUrl;
        }
      }
    }

    return `${window.location.origin}/thumbnail-default.png`;
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

  const mappedCourseInfo = mapCourseInfo(courseDetail);

  return (
    <Container ref={scrollRef}>
      <MetaTags
        title={courseDetail.courseName}
        description={t('seo.courseDescription', mappedCourseInfo)}
        image={getThumbnailUrl()}
        url={window.location.href}
      />
      <Header
        title={courseDetail.courseName}
        isBookmarked={courseDetail.isBookmarked}
        onBack={handleBack}
        onBookmarkToggle={handleBookmarkToggle}
        courseDescription={t('seo.courseDescription', mappedCourseInfo)}
        courseImageUrl={getThumbnailUrl()}
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
  min-height: 100dvh;
  padding-bottom: var(--spacing-32);
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-12);
  height: 100dvh;
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
