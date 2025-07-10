import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import BackgroundImgSrc from '@/assets/images/background-img.png';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(108deg, rgba(69, 97, 255, 0.8) 0%, rgba(28, 55, 206, 0.8) 100%),
    url(${BackgroundImgSrc}) lightgray 50% / cover no-repeat;
  width: 100vw;
  height: 100vh;

  @media (min-width: 601px) {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    max-width: none;
    background-color: var(--surface-surface-default);
    z-index: 10;
  }
`;

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px;
  background: var(--surface-surface-default, #fff);
  border-radius: 24px;
  gap: 44px;

  @media (max-width: 600px) {
    padding: 80px 16px;
    background: transparent;
    border-radius: 0;
    width: 100%;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-12);
  align-self: stretch;
  width: 440px;

  @media (max-width: 600px) {
    width: 100%;
  }

  img {
    width: auto;
    height: 200px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  width: 343px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-12);
  width: 100%;
`;

export const Button = styled.button`
  ${theme.typography.subtitle2};
  padding: 12.5px 16px;
  width: 100%;
  background: var(--primary-primary);
  border-radius: 4px;
  color: #fff;
`;

export const AutoLogin = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  ${theme.typography.body1};
  color: var(--GrayScale-gray700, #777);
  text-align: left;
  cursor: pointer;

  @media (max-width: 600px) {
    color: var(--text-text-inverse, #fff);
  }
`;
