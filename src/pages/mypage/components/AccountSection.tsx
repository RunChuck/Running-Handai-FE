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
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

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
    setIsWithdrawalModalOpen(true);
  };

  const handleWithdrawalConfirm = () => {
    const subject = encodeURIComponent('[러닝한다이] 회원 탈퇴 요청');
    const body = encodeURIComponent(
      [
        '안녕하세요, 러닝한다이입니다.',
        '',
        '개인정보 처리방침에 따라 러너님의 모든 계정 정보를 안전하게 삭제한 후,',
        '삭제 완료 안내를 메일로 보내드리겠습니다.',
        '',
        '=================================',
        '',
        '- 계정 정보(이메일/닉네임):',
        '- 탈퇴 사유:',
        '- 추가 의견:',
        '',
        '=================================',
        '',
        '감사합니다.',
      ].join('\n')
    );

    window.location.href = `mailto:whiteyong2@gmail.com?subject=${subject}&body=${body}`;
    setIsWithdrawalModalOpen(false);
  };

  const handleWithdrawalCancel = () => {
    setIsWithdrawalModalOpen(false);
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

      <CommonModal
        isOpen={isWithdrawalModalOpen}
        onClose={handleWithdrawalCancel}
        onConfirm={handleWithdrawalConfirm}
        title={t('mypage.account.withdrawal')}
        content={t('mypage.account.withdrawalDescription')}
        cancelText={t('cancel')}
        confirmText={t('mypage.account.withdrawalConfirm')}
        isDangerous={true}
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
