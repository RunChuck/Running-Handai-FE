import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { COURSE_LOCATIONS } from '@/constants/locations';
import { useMap } from '@/contexts/MapContext';

import BackIconSrc from '@/assets/icons/arrow-left-24px.svg';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CourseModal = ({ isOpen, onClose }: CourseModalProps) => {
  const { mapRef } = useMap();

  const handleOptionSelect = (option: string) => {
    console.log('선택된 옵션:', option);

    // 지역 옵션인 경우 해당 위치로 이동
    if (option in COURSE_LOCATIONS && mapRef.current) {
      const coordinates = COURSE_LOCATIONS[option as keyof typeof COURSE_LOCATIONS];
      mapRef.current.moveToLocation(coordinates.lat, coordinates.lng);
    }
    // 테마 옵션인 경우
    else if (['바다', '강변', '산', '도심'].includes(option) && mapRef.current) {
      // TODO: 테마별 대표 위치로 이동하는 로직 구현
      console.log('테마 선택:', option);
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
              <OptionButton onClick={() => handleOptionSelect('해운대')}>해운대</OptionButton>
              <OptionButton onClick={() => handleOptionSelect('송정기장')}>송정기장</OptionButton>
              <OptionButton onClick={() => handleOptionSelect('서면동래')}>서면동래</OptionButton>
              <OptionButton onClick={() => handleOptionSelect('원도심영도')}>원도심영도</OptionButton>
              <OptionButton onClick={() => handleOptionSelect('남부해안')}>남부해안</OptionButton>
              <OptionButton onClick={() => handleOptionSelect('서부낙동강')}>서부낙동강</OptionButton>
              <OptionButton onClick={() => handleOptionSelect('북부산')}>북부산</OptionButton>
            </OptionGrid>
          </Section>

          <Section>
            <Subtitle>어떤 테마로 원하세요?</Subtitle>
            <OptionGrid>
              <OptionButton onClick={() => handleOptionSelect('바다')}>바다</OptionButton>
              <OptionButton onClick={() => handleOptionSelect('강변')}>강변</OptionButton>
              <OptionButton onClick={() => handleOptionSelect('산')}>산</OptionButton>
              <OptionButton onClick={() => handleOptionSelect('도심')}>도심</OptionButton>
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

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border: 1px solid var(--line-line-002, #e0e0e0);
  border-radius: 50%;
  background: var(--surface-surface-default, #fff);
  cursor: pointer;
  transition: all 0.2s ease;

  ${theme.typography.body2}
  color: var(--text-text-title, #1c1c1c);

  &:hover {
    background: var(--surface-surface-highlight, #f4f4f4);
    border-color: var(--primary-primary, #4561ff);
  }

  &:active {
    transform: scale(0.98);
  }
`;
