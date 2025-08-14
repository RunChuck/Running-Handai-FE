import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import SVGColor from '@/components/SvgColor';
import InfoIconSrc from '@/assets/icons/info-primary.svg';
import ArrowIconSrc from '@/assets/icons/arrow-down-16px.svg';

const ToolTip = () => {
  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Container>
      <ToolTipContainer isOpen={isOpen}>
        <ToolTipHeader>
          <TitleWrapper>
            <img src={InfoIconSrc} alt="info" />
            <Title>{t('mypage.terms.tip')}</Title>
          </TitleWrapper>
          <ToolTipButton onClick={() => setIsOpen(!isOpen)}>
            <SVGColor
              src={ArrowIconSrc}
              alt="arrow"
              color="#333333"
              width={16}
              height={16}
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </ToolTipButton>
        </ToolTipHeader>
        <ToolTipContent isOpen={isOpen}>
          <ol>
            <li>{t('mypage.terms.tip.content1')}</li>
            <li>{t('mypage.terms.tip.content2')}</li>
            <li>{t('mypage.terms.tip.content3')}</li>
            <li>{t('mypage.terms.tip.content4')}</li>
          </ol>
        </ToolTipContent>
      </ToolTipContainer>
    </Container>
  );
};

export default ToolTip;

const Container = styled.div`
  padding: var(--spacing-24) var(--spacing-24);
`;

const ToolTipContainer = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-16);
  gap: ${props => (props.isOpen ? 'var(--spacing-12)' : '0')};
  border-radius: 4px;
  border: 1px solid var(--line-line-001, #eeeeee);
  background-color: var(--surface-surface-highlight3, #f7f8fa);
  transition: gap 0.3s ease;
`;

const ToolTipHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
`;

const Title = styled.div`
  ${theme.typography.subtitle3}
  color: var(--text-text-title, #1c1c1c);
`;

const ToolTipButton = styled.button`
  cursor: pointer;
`;

const ToolTipContent = styled.div<{ isOpen: boolean }>`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
  padding-left: 20px;
  white-space: pre-wrap;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  max-height: ${props => (props.isOpen ? '194px' : '0')};
  overflow: hidden;
  transition:
    opacity 0.3s ease,
    max-height 0.3s ease;
`;
