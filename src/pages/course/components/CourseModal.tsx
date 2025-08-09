import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { AreaCode, ThemeCode } from '@/types/course';

import BackIconSrc from '@/assets/icons/arrow-left-24px.svg';
import CheckIconSrc from '@/assets/icons/check-circle.svg';
import PaperPlaneIconSrc from '@/assets/icons/paperplane-icon.svg';
import locationOpt1 from '@/assets/images/location-opt1.png';
import locationOpt2 from '@/assets/images/location-opt2.png';
import locationOpt3 from '@/assets/images/location-opt3.png';
import locationOpt4 from '@/assets/images/location-opt4.png';
import locationOpt5 from '@/assets/images/location-opt5.png';
import locationOpt6 from '@/assets/images/location-opt6.png';
import locationOpt7 from '@/assets/images/location-opt7.png';
import themeSea from '@/assets/images/theme-sea.png';
import themeRiver from '@/assets/images/theme-river.png';
import themeMountain from '@/assets/images/theme-mountain.png';
import themeCity from '@/assets/images/theme-city.png';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNearbySelect?: () => void;
  onAreaSelect?: (area: AreaCode) => void;
  onThemeSelect?: (theme: ThemeCode) => void;
  selectedFilter?: {
    type: 'nearby' | 'area' | 'theme';
    value?: AreaCode | ThemeCode;
  };
}

const LOCATION_OPTIONS = [
  { key: 'HAEUN_GWANGAN', image: locationOpt1, zoom: 7 },
  { key: 'SONGJEONG_GIJANG', image: locationOpt2, zoom: 7 },
  { key: 'SEOMYEON_DONGNAE', image: locationOpt3, zoom: 7 },
  { key: 'WONDOSIM', image: locationOpt4, zoom: 7 },
  { key: 'SOUTHERN_COAST', image: locationOpt5, zoom: 7 },
  { key: 'WESTERN_NAKDONGRIVER', image: locationOpt6, zoom: 7 },
  { key: 'NORTHERN_BUSAN', image: locationOpt7, zoom: 7 },
] as const;

const THEME_OPTIONS = [
  { key: 'SEA', image: themeSea, zoom: 8 },
  { key: 'RIVERSIDE', image: themeRiver, zoom: 8 },
  { key: 'MOUNTAIN', image: themeMountain, zoom: 8 },
  { key: 'DOWNTOWN', image: themeCity, zoom: 8 },
] as const;

const CourseModal = ({ isOpen, onClose, onNearbySelect, onAreaSelect, onThemeSelect, selectedFilter }: CourseModalProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    const allImages = [...LOCATION_OPTIONS.map(option => option.image), ...THEME_OPTIONS.map(option => option.image), BackIconSrc];

    allImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleNearbySelect = () => {
    if (onNearbySelect) {
      onNearbySelect();
    }

    onClose();
  };

  const handleLocationSelect = (locationKey: string) => {
    if (onAreaSelect) {
      onAreaSelect(locationKey as AreaCode);
    }

    onClose();
  };

  const handleThemeSelect = (themeKey: string) => {
    if (onThemeSelect) {
      onThemeSelect(themeKey as ThemeCode);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <Header>
          <BackButton onClick={onClose}>
            <img src={BackIconSrc} alt="뒤로가기" />
          </BackButton>
          <Title>🏃‍♂️ {t('modal.courseModal.title')}</Title>
        </Header>

        <Content>
          <Section>
            <Subtitle>{t('modal.courseModal.location')}</Subtitle>
            <OptionGrid>
              <NearbyButton onClick={handleNearbySelect} isSelected={selectedFilter?.type === 'nearby'}>
                <img src={PaperPlaneIconSrc} alt="nearby" />
                {t('location.nearby')}
                {selectedFilter?.type === 'nearby' && <CheckIcon src={CheckIconSrc} alt="check" />}
              </NearbyButton>
              {LOCATION_OPTIONS.map(option => (
                <OptionButton
                  key={option.key}
                  backgroundImage={option.image}
                  onClick={() => handleLocationSelect(option.key)}
                  isSelected={selectedFilter?.type === 'area' && selectedFilter?.value === option.key}
                >
                  {t(`location.${option.key.toLowerCase()}`)}
                  {selectedFilter?.type === 'area' && selectedFilter?.value === option.key && <CheckIcon src={CheckIconSrc} alt="check" />}
                </OptionButton>
              ))}
            </OptionGrid>
          </Section>

          <Section>
            <Subtitle>{t('modal.courseModal.theme')}</Subtitle>
            <OptionGrid>
              {THEME_OPTIONS.map(option => (
                <OptionButton
                  key={option.key}
                  backgroundImage={option.image}
                  onClick={() => handleThemeSelect(option.key)}
                  isSelected={selectedFilter?.type === 'theme' && selectedFilter?.value === option.key}
                >
                  {t(`theme.${option.key.toLowerCase()}`)}
                  {selectedFilter?.type === 'theme' && selectedFilter?.value === option.key && <CheckIcon src={CheckIconSrc} alt="check" />}
                </OptionButton>
              ))}
            </OptionGrid>
          </Section>
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default CourseModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100dvh;
  background: var(--surface-surface-default, #fff);
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 var(--spacing-16);
  border-bottom: 1px solid var(--line-line-001, #eeeeee);
  position: relative;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  color: var(--text-text-title, #1c1c1c);

  &:hover {
    background: var(--surface-surface-highlight, #f4f4f4);
    border-radius: 4px;
  }
`;

const Title = styled.h1`
  ${theme.typography.subtitle2}
  color: var(--text-text-title, #1c1c1c);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
`;

const Content = styled.div`
  flex: 1;
  padding: var(--spacing-24) var(--spacing-16) var(--spacing-16);
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: var(--spacing-24);
`;

const Subtitle = styled.h2`
  ${theme.typography.subtitle2}
  color: var(--text-text-title, #1c1c1c);
  margin: 0 0 var(--spacing-12) 0;
`;

const OptionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
`;

const OptionButton = styled.button<{ backgroundImage: string; isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 64px;
  height: 64px;
  white-space: pre-line;
  border: ${props => (props.isSelected ? '2px solid #4561FF' : 'none')};
  border-radius: 50%;
  background: ${props =>
    props.isSelected
      ? `linear-gradient(0deg, rgba(0, 19, 124, 0.60) 0%, rgba(0, 19, 124, 0.60) 100%), url(${props.backgroundImage}) lightgray 50% / cover no-repeat`
      : `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%), url(${props.backgroundImage}) lightgray 50% / cover no-repeat`};
  cursor: pointer;
  transition: all 0.2s ease;

  ${theme.typography.caption1}
  color: var(--text-text-inverse, #ffffff);
  line-height: 1.2;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const NearbyButton = styled.button<{ isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 64px;
  height: 64px;
  gap: 4px;
  border: ${props => (props.isSelected ? '2px solid #4561FF' : 'none')};
  border-radius: 50%;
  background: ${props => (props.isSelected ? '#3751E6' : '#4561FF')};
  cursor: pointer;
  transition: all 0.2s ease;

  ${theme.typography.caption1}
  color: var(--text-text-inverse, #ffffff);

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CheckIcon = styled.img`
  position: absolute;
  top: -2px;
  right: -2px;
  z-index: 10;
`;
