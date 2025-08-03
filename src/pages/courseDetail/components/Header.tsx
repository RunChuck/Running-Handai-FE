import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import SharePopover from '@/components/SharePopover';
import BackIconSrc from '@/assets/icons/arrow-left-24px.svg';
import ShareIconSrc from '@/assets/icons/share-24px.svg';
import HeartIconSrc from '@/assets/icons/heart-default.svg';
import HeartIconFilledSrc from '@/assets/icons/heart-filled.svg';

interface HeaderProps {
  title: string;
  isBookmarked?: boolean;
  onBack: () => void;
  onBookmarkToggle: () => void;
}

const Header = ({ title, isBookmarked = false, onBack, onBookmarkToggle }: HeaderProps) => {
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);

  const handleShareClick = () => {
    setIsSharePopoverOpen(true);
  };

  const handleCloseSharePopover = () => {
    setIsSharePopoverOpen(false);
  };

  return (
    <Container>
      <IconButton onClick={onBack}>
        <img src={BackIconSrc} alt="back" />
      </IconButton>
      <CenterSection>
        <Title>{title}</Title>
      </CenterSection>
      <RightSection>
        <ShareButtonContainer>
          <IconButton onClick={handleShareClick}>
            <img src={ShareIconSrc} alt="share" />
          </IconButton>
          <SharePopover isOpen={isSharePopoverOpen} onClose={handleCloseSharePopover} courseTitle={title} courseUrl={window.location.href} />
        </ShareButtonContainer>
        <IconButton onClick={onBookmarkToggle}>
          <img src={isBookmarked ? HeartIconFilledSrc : HeartIconSrc} alt="bookmark" />
        </IconButton>
      </RightSection>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 10px;
  background: var(--surface-surface-default);
  border-bottom: 1px solid var(--line-line-001);
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
`;

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  justify-content: flex-end;
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

const Title = styled.h1`
  ${theme.typography.subtitle2}
  color: var(--text-text-title);
  text-align: center;
  white-space: nowrap;
`;

const ShareButtonContainer = styled.div`
  position: relative;
`;
