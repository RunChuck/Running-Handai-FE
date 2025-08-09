import { useNavigate } from 'react-router-dom';
import * as S from './MyPage.styled';

import Header from './components/Header';
import UserInfoSection from './components/UserInfoSection';
import FavoriteSection from './components/FavoriteSection';
import MyCourseSection from './components/MyCourseSection';
import ServiceInfoSection from './components/ServiceInfoSection';

const MyPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <S.Container>
      <Header onBack={handleBack} />
      <UserInfoSection />
      <FavoriteSection />
      <MyCourseSection />
      <ServiceInfoSection />
    </S.Container>
  );
};

export default MyPage;
