import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import CommonModal from './CommonModal';

interface PWAInstallPromptProps {
  onClose?: () => void;
  autoShow?: boolean;
}

const PWAInstallPrompt = ({ onClose, autoShow = true }: PWAInstallPromptProps) => {
  const { t } = useTranslation();
  const { isInstallable, showInstallPrompt } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(autoShow);
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isInstallable || !isVisible) return null;

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await showInstallPrompt();
    setIsInstalling(false);

    if (success) {
      setIsVisible(false);
      onClose?.();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const modalContent = (
    <ContentWrapper>
      <AppIcon src="/AppImages/android/android-launchericon-192-192.png" alt="러닝한다이" />
      <Description>{t('modal.pwaInstall.description')}</Description>
    </ContentWrapper>
  );

  return (
    <CommonModal
      isOpen={isVisible}
      onClose={handleClose}
      onConfirm={handleInstall}
      content={modalContent}
      title={t('modal.pwaInstall.title')}
      cancelText={t('modal.pwaInstall.cancel')}
      confirmText={isInstalling ? t('modal.pwaInstall.installing') : t('modal.pwaInstall.confirm')}
      height="300px"
    />
  );
};

export default PWAInstallPrompt;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-16);
`;

const AppIcon = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
`;

const Description = styled.div`
  ${theme.typography.subtitle4}
  color: var(--text-text-title, #1c1c1c);
  margin-bottom: 12px;
`;
