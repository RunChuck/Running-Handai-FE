import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import * as S from './CourseCreation.styled';
import { useAuth } from '@/hooks/useAuth';
import { useCourseCreation } from '@/contexts/CourseCreationContext';
import { useToast } from '@/hooks/useToast';
import { courseKeys } from '@/constants/queryKeys';

import Header from '@/components/Header';
import CommonModal from '@/components/CommonModal';
import CourseInfoBar from './components/CourseInfoBar';
import CreationBar from './components/CreationBar';
import RouteView from './components/RouteView';
import OnboardingModal from './components/OnboardingModal';
import CourseCreationModal from '@/components/CourseCreationModal';
import CourseLoadingModal from '@/components/CourseLoadingModal';
import InfoIconSrc from '@/assets/icons/info-24px.svg';

const CourseCreation = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showErrorToast } = useToast();
  const queryClient = useQueryClient();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCourseCreationModalOpen, setIsCourseCreationModalOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

  const routeViewRef = useRef<HTMLDivElement>(null);

  const { gpxData, handleMarkersChange, handleCourseCreate, setMapInstance, isRouteGenerated, isGpxUploaded, uploadedGpxFile } = useCourseCreation();

  useEffect(() => {
    if (isAuthenticated) {
      const hasSeenOnboarding = localStorage.getItem('onboardingSeen');
      if (!hasSeenOnboarding) {
        setIsOnboardingOpen(true);
      }
    } else {
      setIsLoginModalOpen(true);
    }
  }, [isAuthenticated]);

  const handleOnboardingClose = () => {
    setIsOnboardingOpen(false);
    localStorage.setItem('onboardingSeen', 'true');
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
    navigate(-1);
  };

  const handleCourseCreationModalClose = () => {
    setIsCourseCreationModalOpen(false);
  };

  const handleCourseSubmit = async () => {
    try {
      setIsCourseCreationModalOpen(false);
      setIsLoadingModalOpen(true);

      // 코스 생성 성공 후 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: courseKeys.all });

      setTimeout(() => {
        setIsLoadingModalOpen(false);
        navigate(`/mypage/mycourse`);
      }, 1000);
    } catch (error) {
      setIsLoadingModalOpen(false);
      console.error('Course submission failed:', error);

      // 중복 코스명 에러인 경우: 생성 모달을 다시 열고 토스트 표시
      if (error?.response?.data?.responseCode === 'DUPLICATE_COURSE_NAME') {
        setIsCourseCreationModalOpen(true);
        showErrorToast('이미 존재하는 코스 이름입니다.', { position: 'top' });
      } else {
        showErrorToast('코스 등록 중 오류가 발생했습니다.', { position: 'top' });
      }
    }
  };

  const handleCourseCreateWrapper = async () => {
    await handleCourseCreate();
    setIsCourseCreationModalOpen(true);
  };

  return (
    <S.Container>
      <Header
        title={t('courseCreation.title')}
        onBack={() => navigate(-1)}
        rightIcon={InfoIconSrc}
        onRightIconClick={() => setIsOnboardingOpen(true)}
      />
      <CourseInfoBar
        distance={gpxData?.distance || 0}
        time={gpxData?.time || 0}
        maxAltitude={gpxData?.maxAltitude || 0}
        minAltitude={gpxData?.minAltitude || 0}
      />
      <RouteView ref={routeViewRef} onMapLoad={setMapInstance} onMarkersChange={handleMarkersChange} isRouteGenerated={isRouteGenerated} />
      <CreationBar onCreateCourse={isRouteGenerated ? () => setIsCourseCreationModalOpen(true) : handleCourseCreateWrapper} />

      <OnboardingModal isOpen={isOnboardingOpen} onClose={handleOnboardingClose} />

      <CommonModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onConfirm={() => navigate('/')}
        content={t('main.loginMessage.create')}
        cancelText={t('cancel')}
        confirmText={t('main.simpleLogin')}
      />

      <CourseCreationModal
        isOpen={isCourseCreationModalOpen}
        onClose={handleCourseCreationModalClose}
        onConfirm={handleCourseSubmit}
        confirmText={t('modal.courseCreation.complete')}
        routeCoordinates={gpxData?.coordinates || []}
        isGpxUploaded={isGpxUploaded}
        uploadedGpxFile={uploadedGpxFile}
        gpxData={gpxData}
      />

      <CourseLoadingModal isOpen={isLoadingModalOpen} />
    </S.Container>
  );
};

export default CourseCreation;
