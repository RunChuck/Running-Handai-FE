import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useDebouncedCurrentLocation, type MapInstance } from '@/utils/locationUtils';

import FloatButton from '@/components/FloatButton';
import UploadIconSrc from '@/assets/icons/gpx-upload.svg';
import UndoIconSrc from '@/assets/icons/undo-icon.svg';
import RedoIconSrc from '@/assets/icons/redo-icon.svg';
import SwapIconSrc from '@/assets/icons/swap-icon.svg';
import DeleteIconSrc from '@/assets/icons/delete-icon.svg';
import LocationIconSrc from '@/assets/icons/location-icon.svg';

interface CreationBarProps {
  mapInstance?: MapInstance | null;
  onCreateCourse?: () => void;
}

const CreationBar = ({ mapInstance, onCreateCourse }: CreationBarProps) => {
  const [t] = useTranslation();
  const moveToCurrentLocation = useDebouncedCurrentLocation(mapInstance);

  const CreationMenu = [
    {
      id: 1,
      icon: UploadIconSrc,
      label: t('courseCreation.course.upload'),
    },
    {
      id: 2,
      icon: UndoIconSrc,
      label: t('courseCreation.course.undo'),
    },
    {
      id: 3,
      icon: RedoIconSrc,
      label: t('courseCreation.course.redo'),
    },
    {
      id: 4,
      icon: SwapIconSrc,
      label: t('courseCreation.course.swap'),
    },
    {
      id: 5,
      icon: DeleteIconSrc,
      label: t('courseCreation.course.delete'),
    },
  ];

  return (
    <Container>
      <CreateButton onClick={onCreateCourse}>{t('courseCreation.create')}</CreateButton>
      <FloatButton position={{ top: -56, right: 16 }} onClick={moveToCurrentLocation}>
        <img src={LocationIconSrc} alt={t('currentLocation')} width={20} height={20} />
      </FloatButton>
      <CreationBarContainer>
        {CreationMenu.map(menu => (
          <MenuButton key={menu.id}>
            <MenuIcon src={menu.icon} alt={menu.label} />
            <MenuLabel>{menu.label}</MenuLabel>
          </MenuButton>
        ))}
      </CreationBarContainer>
    </Container>
  );
};

export default CreationBar;

const Container = styled.div`
  position: relative;
`;

const CreateButton = styled.button`
  ${theme.typography.subtitle3}
  color: #FFF;
  position: absolute;
  top: -56px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 24px;
  border-radius: 100px;
  background: var(--primary-primary, #4561ff);
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 1;

  @media (max-width: 600px) {
    ${theme.typography.caption1}
  }

  &:hover {
    background: var(--primary-primary002, #2845e9);
  }

  &:active {
    background: var(--primary-primary003, #1b37d3);
  }

  &:disabled {
    background: var(--GrayScale-gray400, #bbb);
    cursor: not-allowed;
  }
`;

const CreationBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-12) 65px;
  background: #fff;
  box-shadow: 0 -1px 8px 0 rgba(0, 0, 0, 0.05);

  @media (max-width: 600px) {
    padding: 8px 24px;
  }
`;

const MenuButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  width: 42px;
  height: 44px;
  cursor: pointer;

  @media (max-width: 600px) {
    width: 42px;
    height: 40px;
  }
`;

const MenuIcon = styled.img`
  width: 28px;
  height: 28px;

  @media (max-width: 600px) {
    width: 24px;
    height: 24px;
  }
`;

const MenuLabel = styled.span`
  ${theme.typography.label3}
`;
