import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as S from './CourseCreation.styled';

import Header from '@/components/Header';
import CourseInfoBar from './components/CourseInfoBar';
import CreationBar from './components/CreationBar';
import MapView from '@/components/MapView';
import InfoIconSrc from '@/assets/icons/info-24px.svg';

const CourseCreation = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  return (
    <S.Container>
      <Header title={t('courseCreation.title')} onBack={() => navigate(-1)} rightIcon={InfoIconSrc} onRightIconClick={() => {}} />
      <CourseInfoBar distance={10} time={100} maxAltitude={1000} minAltitude={0} />
      <MapView />
      <CreationBar />
    </S.Container>
  );
};

export default CourseCreation;
