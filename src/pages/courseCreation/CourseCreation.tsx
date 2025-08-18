import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as S from './CourseCreation.styled';
import { useAuth } from '@/hooks/useAuth';

import Header from '@/components/Header';
import CommonModal from '@/components/CommonModal';
import CourseInfoBar from './components/CourseInfoBar';
import CreationBar from './components/CreationBar';
import MapView from '@/components/MapView';
import OnboardingModal from './components/OnboardingModal';
import InfoIconSrc from '@/assets/icons/info-24px.svg';

const CourseCreation = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

  return (
    <S.Container>
      <Header
        title={t('courseCreation.title')}
        onBack={() => navigate(-1)}
        rightIcon={InfoIconSrc}
        onRightIconClick={() => setIsOnboardingOpen(true)}
      />
      <CourseInfoBar distance={10} time={100} maxAltitude={1000} minAltitude={0} />
      <MapView />
      <CreationBar />

      <OnboardingModal isOpen={isOnboardingOpen} onClose={handleOnboardingClose} />

      <CommonModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onConfirm={() => navigate('/')}
        content={t('main.loginMessage.create')}
        cancelText={t('cancel')}
        confirmText={t('main.simpleLogin')}
      />
    </S.Container>
  );
};

export default CourseCreation;
