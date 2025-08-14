import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import Header from '../components/Header';
import CommonInput from '@/components/CommonInput';
import Button from '@/components/Button';

const InfoPage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  // TODO: 닉네임 받아오기
  const [nickname, setNickname] = useState('슬기로운다람쥐1231');

  return (
    <Container>
      <Header title={t('mypage.Info.title')} onBack={() => navigate(-1)} />
      <Content>
        <InfoContent>
          <InfoWrapper>
            <Label>{t('mypage.Info.email')}</Label>
            <UserEmail>test@test.com</UserEmail>
          </InfoWrapper>
          <InfoWrapper>
            <Label>{t('mypage.Info.nickname')}</Label>
            <CommonInput value={nickname} onChange={setNickname} placeholder={t('mypage.Info.nicknamePlaceholder')} />
          </InfoWrapper>
        </InfoContent>
        <Button variant="primary" disabled={nickname.length === 0}>
          {t('mypage.Info.confirm')}
        </Button>
      </Content>
    </Container>
  );
};

export default InfoPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 32px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 44px 16px;
  gap: var(--spacing-32);
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
`;

const Label = styled.div`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;

const UserEmail = styled.span`
  ${theme.typography.body2};
  color: var(--text-text-title, #1c1c1c);
`;
