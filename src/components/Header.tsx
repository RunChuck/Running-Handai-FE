import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import BackIconSrc from '@/assets/icons/arrow-left-24px.svg';
import LogoIconSrc from '@/assets/icons/logo.svg';

interface HeaderProps {
  onBack: () => void;
  title?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
}

const Header = ({ onBack, title, rightIcon, onRightIconClick }: HeaderProps) => {
  return (
    <Container>
      <IconButton onClick={onBack}>
        <img src={BackIconSrc} alt="back" />
      </IconButton>
      {title ? (
        <Title>{title}</Title>
      ) : (
        <LogoWrapper>
          <LogoIcon src={LogoIconSrc} alt="logo" />
        </LogoWrapper>
      )}
      {rightIcon ? (
        <IconButton onClick={onRightIconClick}>
          <img src={rightIcon} alt="right icon" />
        </IconButton>
      ) : (
        <div style={{ width: '24px', height: '24px' }} />
      )}
    </Container>
  );
};

export default Header;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 10px;
  background: var(--surface-surface-default);
  border-bottom: 1px solid var(--line-line-001);
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
`;

const LogoWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const LogoIcon = styled.img`
  width: auto;
  height: 24px;

  @media (max-width: 600px) {
    height: 20px;
  }
`;

const Title = styled.div`
  ${theme.typography.subtitle2};
  color: var(--text-text-title, #1c1c1c);
  flex: 1;
  display: flex;
  justify-content: center;

  @media (max-width: 600px) {
    ${theme.typography.subtitle3}
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--surface-surface-highlight);
  }
`;
