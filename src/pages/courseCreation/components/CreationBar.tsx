import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useDebouncedCurrentLocation } from '@/utils/locationUtils';
import { useCourseCreation } from '@/contexts/CourseCreationContext';
import { useToast } from '@/hooks/useToast';

import FloatButton from '@/components/FloatButton';
import SVGColor from '@/components/SvgColor';
import UploadIconSrc from '@/assets/icons/gpx-upload.svg';
import UndoIconSrc from '@/assets/icons/undo-icon.svg';
import RedoIconSrc from '@/assets/icons/redo-icon.svg';
import SwapIconSrc from '@/assets/icons/swap-icon.svg';
import DeleteIconSrc from '@/assets/icons/delete-icon.svg';
import LocationIconSrc from '@/assets/icons/location-icon.svg';

interface CreationBarProps {
  onCreateCourse?: () => void;
}

const CreationBar = ({ onCreateCourse }: CreationBarProps) => {
  const [t] = useTranslation();
  const { mapInstance, buttonStates, handleGpxUpload, handleUndo, handleRedo, handleSwap, handleDelete, isLoading, isRouteGenerated } =
    useCourseCreation();
  const { showErrorToast } = useToast();

  const moveToCurrentLocation = useDebouncedCurrentLocation(mapInstance);

  const CreationMenu = [
    {
      id: 1,
      icon: UploadIconSrc,
      label: t('courseCreation.course.upload'),
      enabled: buttonStates.gpx,
      onClick: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.gpx';
        input.onchange = e => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            if (!file.name.toLowerCase().endsWith('.gpx')) {
              showErrorToast('GPX 파일만 업로드 가능합니다.');
              return;
            }
            handleGpxUpload(file);
          }
        };
        input.click();
      },
    },
    {
      id: 2,
      icon: UndoIconSrc,
      label: t('courseCreation.course.undo'),
      enabled: buttonStates.undo,
      onClick: handleUndo,
    },
    {
      id: 3,
      icon: RedoIconSrc,
      label: t('courseCreation.course.redo'),
      enabled: buttonStates.redo,
      onClick: handleRedo,
    },
    {
      id: 4,
      icon: SwapIconSrc,
      label: t('courseCreation.course.swap'),
      enabled: buttonStates.swap,
      onClick: handleSwap,
    },
    {
      id: 5,
      icon: DeleteIconSrc,
      label: t('courseCreation.course.delete'),
      enabled: buttonStates.delete,
      onClick: handleDelete,
    },
  ];

  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (isLoading) {
      return t('courseCreation.creating'); // "생성 중"
    } else if (isRouteGenerated) {
      return t('courseCreation.register'); // "코스 등록"
    } else {
      return t('courseCreation.create'); // "코스 생성"
    }
  };

  return (
    <Container>
      <CreateButton
        enabled={buttonStates.create || isRouteGenerated}
        onClick={buttonStates.create || isRouteGenerated ? onCreateCourse : undefined}
        isLoading={isLoading}
      >
        {getButtonText()}
      </CreateButton>
      <FloatButton position={{ top: -56, right: 16 }} onClick={moveToCurrentLocation}>
        <img src={LocationIconSrc} alt={t('currentLocation')} width={20} height={20} />
      </FloatButton>
      <CreationBarContainer>
        {CreationMenu.map(menu => (
          <MenuButton key={menu.id} enabled={menu.enabled} onClick={menu.enabled ? menu.onClick : undefined}>
            <IconWrapper>
              <SVGColor src={menu.icon} color={menu.enabled ? '#333' : '#BBBBBB'} width="100%" height="100%" />
            </IconWrapper>
            <MenuLabel enabled={menu.enabled}>{menu.label}</MenuLabel>
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

const CreateButton = styled.button<{ enabled: boolean; isLoading?: boolean }>`
  ${theme.typography.subtitle3}
  color: #FFF;
  position: absolute;
  top: -56px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 24px;
  border-radius: 100px;
  background: ${({ enabled }) => (enabled ? 'var(--primary-primary, #4561ff)' : '#BBBBBB')};
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.2);
  cursor: ${({ enabled }) => (enabled ? 'pointer' : 'not-allowed')};
  z-index: 1;
  transition: all 0.3s ease;

  @media (max-width: 600px) {
    ${theme.typography.caption1}
  }

  &:hover {
    background: ${({ enabled }) => (enabled ? 'var(--primary-primary002, #2845e9)' : '#BBBBBB')};
  }

  &:active {
    background: ${({ enabled }) => (enabled ? 'var(--primary-primary003, #1b37d3)' : '#BBBBBB')};
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

  /* 홈 인디케이터 영역 고려 */
  @media (display-mode: standalone) {
    padding-bottom: env(safe-area-inset-bottom);

    @supports (padding: max(0px)) {
      padding-bottom: max(env(safe-area-inset-bottom), 0px);
    }
  }
`;

const MenuButton = styled.div<{ enabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  width: 42px;
  height: 44px;
  cursor: ${({ enabled }) => (enabled ? 'pointer' : 'not-allowed')};
  opacity: ${({ enabled }) => (enabled ? 1 : 0.6)};
  transition:
    opacity 0.3s ease,
    cursor 0.3s ease;

  @media (max-width: 600px) {
    width: 42px;
    height: 40px;
  }
`;

const IconWrapper = styled.div`
  width: 28px;
  height: 28px;
  transition: all 0.3s ease;

  @media (max-width: 600px) {
    width: 24px;
    height: 24px;
  }

  svg {
    transition: all 0.3s ease;
  }
`;

const MenuLabel = styled.span<{ enabled: boolean }>`
  ${theme.typography.label3}
  color: ${({ enabled }) => (enabled ? '#333' : '#BBBBBB')};
  transition: color 0.3s ease;
`;
