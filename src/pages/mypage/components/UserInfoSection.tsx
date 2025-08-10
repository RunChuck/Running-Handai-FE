import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import * as S from '../MyPage.styled';
import { theme } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth';

import SVGColor from '@/components/SvgColor';
import ProfileIconSrc from '@/assets/icons/profile-default.svg';
import BookIconSrc from '@/assets/icons/book-icon.svg';
import SpeechBubbleIconSrc from '@/assets/icons/speech-bubble.svg';

const UserInfoSection = () => {
  const [t] = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <S.SectionContainer>
      <Greeting>
        <UserNickname>{t('mypage.defaultNickname')}</UserNickname>
        {t('mypage.greeting')}
      </Greeting>
      <ButtonContainer>
        {isAuthenticated ? (
          <>
            <ButtonSection>
              <ButtonWrapper>
                <RoundButton onClick={() => navigate('/my-info')}>
                  <SVGColor src={ProfileIconSrc} width={18} height={18} color="#FFFFFF" />
                </RoundButton>
                <ButtonText>{t('mypage.myInfo')}</ButtonText>
              </ButtonWrapper>
            </ButtonSection>
            <Divider />
            <ButtonSection>
              <ButtonWrapper>
                <RoundButton onClick={() => navigate('/my-review')}>
                  <img src={SpeechBubbleIconSrc} alt="profile" />
                </RoundButton>
                <ButtonText>{t('mypage.myReview')}</ButtonText>
              </ButtonWrapper>
            </ButtonSection>
          </>
        ) : (
          <ButtonSection>
            <ButtonWrapper>
              <RoundButton onClick={() => navigate('/')}>
                <SVGColor src={ProfileIconSrc} width={18} height={18} color="#FFFFFF" />
              </RoundButton>
              <ButtonText>{t('mypage.socialLogin')}</ButtonText>
            </ButtonWrapper>
          </ButtonSection>
        )}
        <Divider />
        <ButtonSection>
          <ButtonWrapper>
            <RoundButton onClick={() => navigate('/running-terms')}>
              <img src={BookIconSrc} alt="profile" />
            </RoundButton>
            <ButtonText>{t('mypage.runningTerms')}</ButtonText>
          </ButtonWrapper>
        </ButtonSection>
      </ButtonContainer>
    </S.SectionContainer>
  );
};

export default UserInfoSection;

const Greeting = styled.div`
  ${theme.typography.subtitle4};
  color: var(--text-text-title, #1c1c1c);
  width: 100%;
  text-align: center;
  white-space: pre-line;
`;

const UserNickname = styled.span`
  ${theme.typography.subtitle2};
  color: var(--text-text-primary, #4561ff);
`;

const ButtonContainer = styled.div`
  display: flex;
  align-self: stretch;
`;

const ButtonSection = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Divider = styled.div`
  width: 1px;
  height: 60px;
  background: var(--line-line-001, #eeeeee);
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const RoundButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4561ff -0.21%, #6078ff 99.79%);
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

const ButtonText = styled.span`
  ${theme.typography.body2};
  color: var(--text-text-title, #1c1c1c);
`;
