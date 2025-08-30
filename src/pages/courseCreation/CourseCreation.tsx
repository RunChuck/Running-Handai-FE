import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as S from './CourseCreation.styled';
import { useAuth } from '@/hooks/useAuth';
import { useCourseCreation } from '@/contexts/CourseCreationContext';

import Header from '@/components/Header';
import CommonModal from '@/components/CommonModal';
import CourseInfoBar from './components/CourseInfoBar';
import CreationBar from './components/CreationBar';
import RouteView from './components/RouteView';
import OnboardingModal from './components/OnboardingModal';
import CourseCreationModal from '@/components/CourseCreationModal';
import InfoIconSrc from '@/assets/icons/info-24px.svg';

const CourseCreation = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCourseCreationModalOpen, setIsCourseCreationModalOpen] = useState(false);

  const { gpxData, handleMarkersChange, handleCourseCreate, setMapInstance, isRouteGenerated } = useCourseCreation();

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
      <RouteView onMapLoad={setMapInstance} onMarkersChange={handleMarkersChange} isRouteGenerated={isRouteGenerated} />
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
        onConfirm={handleCourseCreationModalClose}
        confirmText={t('modal.courseCreation.complete')}
      />
    </S.Container>
  );
};

export default CourseCreation;
