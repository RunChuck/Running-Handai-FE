import { useNavigate } from 'react-router-dom';
import * as S from './CourseCreation.styled';
import Header from '@/components/Header';

import InfoIconSrc from '@/assets/icons/info-24px.svg';

const CourseCreation = () => {
  const navigate = useNavigate();

  return (
    <S.Container>
      <Header title="코스 생성" onBack={() => navigate(-1)} rightIcon={InfoIconSrc} onRightIconClick={() => {}} />
    </S.Container>
  );
};

export default CourseCreation;