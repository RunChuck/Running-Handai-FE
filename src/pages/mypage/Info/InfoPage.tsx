import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useUserStore } from '@/stores/userStore';
import { authAPI } from '@/api/auth';
import { useToast } from '@/hooks/useToast';

import Header from '../../../components/Header';
import CommonInput from '@/components/CommonInput';
import Button from '@/components/Button';

const InfoPage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUserStore();
  const { showSuccessToast, showErrorToast } = useToast();

  const [nickname, setNickname] = useState(userInfo?.nickname);
  const [nicknameError, setNicknameError] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const validateNickname = (value: string) => {
    // 글자수 검사
    if (value.length > 0 && value.length < 2) {
      return t('mypage.Info.nicknameStatus.tooShort');
    }

    // 한글, 영어(소문자), 숫자만 허용 (특수문자 제외)
    const validPattern = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]*$/;
    if (!validPattern.test(value)) {
      return t('mypage.Info.nicknameStatus.invalidChar');
    }

    return '';
  };

  const handleNicknameError = (responseCode: string) => {
    switch (responseCode) {
      case 'INVALID_NICKNAME_LENGTH':
        return t('mypage.Info.nicknameStatus.tooShort');
      case 'INVALID_NICKNAME_FORMAT':
        return t('mypage.Info.nicknameStatus.invalidChar');
      case 'SAME_AS_CURRENT_NICKNAME':
        return t('mypage.Info.nicknameStatus.sameAsCurrent');
      case 'INVALID_INPUT_VALUE':
        return t('mypage.Info.nicknameStatus.invalidChar');
      case 'MEMBER_NOT_FOUND':
        return t('mypage.Info.nicknameStatus.notFound');
      case 'UNAUTHORIZED_ACCESS':
        return t('mypage.Info.nicknameStatus.unauthorized');
      case 'DUPLICATE_NICKNAME':
        return t('mypage.Info.nicknameStatus.duplicate');
      default:
        return t('mypage.Info.nicknameStatus.error');
    }
  };

  const handleNicknameChange = (value: string) => {
    const lowerValue = value.toLowerCase();

    if (lowerValue.length > 10) {
      return;
    }

    setNickname(lowerValue);
    const error = validateNickname(lowerValue);
    setNicknameError(error);
    setIsNicknameAvailable(null);
  };

  const handleCheckDuplicate = async () => {
    if (isCheckButtonDisabled) return;

    try {
      const response = await authAPI.checkNickname(nickname);
      if (response.data) {
        setIsNicknameAvailable(true);
        setNicknameError('');
      } else {
        setIsNicknameAvailable(false);
        setNicknameError(t('mypage.Info.nicknameStatus.duplicate'));
      }
    } catch (error: unknown) {
      setIsNicknameAvailable(null);
      const responseCode = (error as { response?: { data?: { responseCode?: string } } })?.response?.data?.responseCode;
      setNicknameError(handleNicknameError(responseCode || ''));
    }
  };

  const handleUpdateNickname = async () => {
    if (!isNicknameAvailable || isUpdating) return;

    setIsUpdating(true);
    try {
      const response = await authAPI.updateUserInfo(nickname);
      setUserInfo({
        ...userInfo,
        nickname: response.data.nickname,
      });
      showSuccessToast(t('mypage.Info.nicknameStatus.updateSuccess'), { position: 'top' });
      navigate(-1);
    } catch (error: unknown) {
      const responseCode = (error as { response?: { data?: { responseCode?: string } } })?.response?.data?.responseCode;
      const errorMessage = handleNicknameError(responseCode || '');
      showErrorToast(errorMessage);
      setNicknameError(errorMessage);
      setIsNicknameAvailable(null);
    } finally {
      setIsUpdating(false);
    }
  };

  const isCheckButtonDisabled = nickname.length < 2 || nickname === userInfo?.nickname || !!nicknameError;

  if (!userInfo) {
    showErrorToast(t('mypage.Info.nicknameStatus.notFound'));
    navigate(-1);
  }

  return (
    <Container>
      <Header title={t('mypage.Info.title')} onBack={() => navigate(-1)} />
      <Content>
        <InfoContent>
          <InfoWrapper>
            <Label>{t('mypage.Info.email')}</Label>
            <UserEmail>{userInfo?.email}</UserEmail>
          </InfoWrapper>
          <InfoWrapper>
            <Label>{t('mypage.Info.nickname')}</Label>
            <NicknameWrapper>
              <CommonInput
                value={nickname}
                onChange={handleNicknameChange}
                placeholder={t('mypage.Info.nicknamePlaceholder')}
                state={nicknameError ? 'negative' : isNicknameAvailable === true ? 'positive' : 'default'}
                validationText={nicknameError || (isNicknameAvailable === true ? t('mypage.Info.nicknameStatus.available') : '')}
              />
              <CheckButton disabled={isCheckButtonDisabled} onClick={handleCheckDuplicate}>
                {t('mypage.Info.checkDuplicate')}
              </CheckButton>
            </NicknameWrapper>
          </InfoWrapper>
        </InfoContent>
        <Button
          variant="primary"
          disabled={!isNicknameAvailable || nickname === (userInfo?.nickname || '') || isUpdating}
          onClick={handleUpdateNickname}
        >
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

const NicknameWrapper = styled.div`
  display: flex;
  gap: var(--spacing-4);

  > div:first-of-type {
    flex: 1;
  }
`;

const Label = styled.div`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;

const UserEmail = styled.span`
  ${theme.typography.body2};
  color: var(--text-text-title, #1c1c1c);
`;

const CheckButton = styled.button<{ disabled: boolean }>`
  width: 73px;
  height: 44px;
  background: ${props => (props.disabled ? '#F4F4F4' : '#ffffff')};
  border: 1px solid #eeeeee;
  border-radius: 4px;
  ${theme.typography.caption1};
  color: ${props => (props.disabled ? 'var(--text-text-disabled, #CCCCCC)' : 'var(--text-text-secondary, #555555)')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #f9f9f9;
  }
`;
