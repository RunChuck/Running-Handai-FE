import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import * as S from '../MyPage.styled';
import { theme } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth';
import CommonModal from '@/components/CommonModal';

const AccountSection = () => {
  const [t] = useTranslation();
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const handleWithdrawal = () => {
    // TODO: 회원 탈퇴 기능 구현
  };

  return (
    <>
      <S.SectionDivider />
      <S.SectionContainer2>
        <SectionTitle>{t('mypage.account.title')}</SectionTitle>
        <LogoutButton onClick={handleLogoutClick}>{t('mypage.account.logout')}</LogoutButton>
        <WithdrawalButton onClick={handleWithdrawal}>{t('mypage.account.withdrawal')}</WithdrawalButton>
      </S.SectionContainer2>

      <CommonModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        content={t('mypage.account.logoutConfirm')}
        cancelText={t('cancel')}
        confirmText={t('mypage.account.logout')}
      />
    </>
  );
};

export default AccountSection;

const SectionTitle = styled.div`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;

const LogoutButton = styled.button`
  ${theme.typography.body2};
  color: var(--text-text-title, #1c1c1c);
  text-align: left;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const WithdrawalButton = styled.button`
  ${theme.typography.body2};
  color: var(--text-text-error, #ff0010);
  text-align: left;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
