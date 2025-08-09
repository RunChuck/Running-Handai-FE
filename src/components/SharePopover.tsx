import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/useToast';
import { shareToKakao } from '@/utils/kakao';

import KakaoIconSrc from '@/assets/icons/kakao-icon.svg';
import CopyIconSrc from '@/assets/icons/copy-24px.svg';

interface SharePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  courseDescription: string;
  courseImageUrl: string;
  courseUrl: string;
}

const SharePopover = ({ isOpen, onClose, courseTitle, courseDescription, courseImageUrl, courseUrl }: SharePopoverProps) => {
  const [t] = useTranslation();
  const { showSuccessToast, showErrorToast } = useToast();

  const handleKakaoShare = () => {
    shareToKakao({
      title: courseTitle,
      description: courseDescription,
      imageUrl: courseImageUrl,
      webUrl: courseUrl,
    });
    onClose();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(courseUrl);
      showSuccessToast(t('toast.copyLinkSuccess'), { position: 'top' });
      onClose();
    } catch (error) {
      console.error('링크 복사 실패:', error);
      showErrorToast(t('toast.copyLinkFailed'), { position: 'top' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={onClose} />
      <Container>
        <ShareOptionsContainer>
          <KakaoIcon onClick={handleKakaoShare}>
            <img src={KakaoIconSrc} alt="카카오톡" />
          </KakaoIcon>
          <CopyIcon onClick={handleCopyLink}>
            <img src={CopyIconSrc} alt="링크 복사" />
          </CopyIcon>
        </ShareOptionsContainer>
        <Arrow />
      </Container>
    </>
  );
};

export default SharePopover;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

const Container = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const Arrow = styled.div`
  position: absolute;
  top: -6px;
  right: 20px;
  width: 12px;
  height: 12px;
  background: white;
  transform: rotate(45deg);
  box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.1);
`;

const ShareOptionsContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const KakaoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fee500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const CopyIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--GrayScale-gray200, #eeeeee);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
