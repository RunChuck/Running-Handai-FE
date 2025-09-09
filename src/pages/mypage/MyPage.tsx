import { useNavigate } from 'react-router-dom';
import * as S from './MyPage.styled';
import { useAuth } from '@/hooks/useAuth';
import { useUserInfo } from '@/hooks/useUserInfo';

import Header from '@/components/Header';
import UserInfoSection from './components/UserInfoSection';
import FavoriteSection from './components/FavoriteSection';
import MyCourseSection from './components/MyCourseSection';
import ServiceInfoSection from './components/ServiceInfoSection';
import AccountSection from './components/AccountSection';

const MyPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: userInfoResponse } = useUserInfo();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <S.Container>
      <Header onBack={handleBack} />
      <UserInfoSection isAuthenticated={isAuthenticated} userInfo={userInfoResponse?.data} />
      <FavoriteSection isAuthenticated={isAuthenticated} />
      <MyCourseSection isAuthenticated={isAuthenticated} />
      <ServiceInfoSection />
      {isAuthenticated && <AccountSection />}
    </S.Container>
  );
};

export default MyPage;
