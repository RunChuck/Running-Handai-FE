import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { COURSE_LOCATIONS, THEME_LOCATIONS } from '@/constants/locations';
import { useMap } from '@/contexts/MapContext';

import BackIconSrc from '@/assets/icons/arrow-left-24px.svg';
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
}

const LOCATION_OPTIONS = [
  { key: '해운대', label: '해운\n광안', image: locationOpt1 },
  { key: '송정기장', label: '송정\n기장', image: locationOpt2 },
  { key: '서면동래', label: '서면\n동래', image: locationOpt3 },
  { key: '원도심영도', label: '원도심\n영도', image: locationOpt4 },
  { key: '남부해안', label: '남부해안', image: locationOpt5 },
  { key: '서부낙동강', label: '서부\n낙동강', image: locationOpt6 },
  { key: '북부산', label: '북부산', image: locationOpt7 },
] as const;

const THEME_OPTIONS = [
  { key: '바다', label: '바다', image: themeSea },
  { key: '강변', label: '강변', image: themeRiver },
  { key: '산', label: '산', image: themeMountain },
  { key: '도심', label: '도심', image: themeCity },
] as const;

const CourseModal = ({ isOpen, onClose }: CourseModalProps) => {
  const { mapRef } = useMap();

  const handleOptionSelect = (option: string) => {
    // 지역 옵션인 경우 해당 위치로 이동
    if (option in COURSE_LOCATIONS && mapRef.current) {
      const coordinates = COURSE_LOCATIONS[option as keyof typeof COURSE_LOCATIONS];
      mapRef.current.moveToLocation(coordinates.lat, coordinates.lng);
    }
    // 테마 옵션인 경우 해당 테마의 대표 위치로 이동
    else if (option in THEME_LOCATIONS && mapRef.current) {
      const coordinates = THEME_LOCATIONS[option as keyof typeof THEME_LOCATIONS];
      mapRef.current.moveToLocation(coordinates.lat, coordinates.lng);
      console.log('테마 선택:', option, '위치 이동:', coordinates);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <Header>
          <BackButton onClick={onClose}>
            <img src={BackIconSrc} alt="닫기" />
          </BackButton>
          <Title>🏃‍♂️ 추천 코스 탐색</Title>
        </Header>

        <Content>
          <Section>
            <Subtitle>어디로 가시나요?</Subtitle>
            <OptionGrid>
              {LOCATION_OPTIONS.map((option) => (
                <OptionButton 
                  key={option.key}
                  backgroundImage={option.image} 
                  onClick={() => handleOptionSelect(option.key)}
                >
                  {option.label}
                </OptionButton>
              ))}
            </OptionGrid>
          </Section>

          <Section>
            <Subtitle>어떤 테마로 원하세요?</Subtitle>
            <OptionGrid>
              {THEME_OPTIONS.map((option) => (
                <OptionButton 
                  key={option.key}
                  backgroundImage={option.image} 
                  onClick={() => handleOptionSelect(option.key)}
                >
                  {option.label}
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
  height: 100vh;
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

const OptionButton = styled.button<{ backgroundImage: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  white-space: pre-line;
  border: 1px solid var(--line-line-002, #e0e0e0);
  border-radius: 50%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%),
    url(${props => props.backgroundImage}) lightgray 50% / cover no-repeat;
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
