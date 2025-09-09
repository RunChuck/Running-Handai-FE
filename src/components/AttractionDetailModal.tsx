import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { SpotData } from '@/types/course';
import { formatDescription } from '@/utils/format';
import AttractionTumbnailSrc from '@/assets/images/thumbnail-default.png';
import CloseIconSrc from '@/assets/icons/close-24px.svg';

interface AttractionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  spot: SpotData | null;
}

const AttractionDetailModal = ({ isOpen, onClose, spot }: AttractionDetailModalProps) => {
  if (!isOpen || !spot) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <img src={CloseIconSrc} alt="close" />
        </CloseButton>

        <Content>
          <Title>{spot.name}</Title>
          <ThumbnailWrapper>
            <Thumbnail
              src={spot.imageUrl || AttractionTumbnailSrc}
              alt={spot.name}
              className={!spot.imageUrl ? 'default-image' : ''}
              onError={e => {
                e.currentTarget.src = AttractionTumbnailSrc;
                e.currentTarget.classList.add('default-image');
              }}
            />
          </ThumbnailWrapper>

          <Description>{formatDescription(spot.description)}</Description>
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default AttractionDetailModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(1.5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
`;

const ModalContainer = styled.div`
  position: relative;
  width: calc(100vw - 32px);
  max-width: 568px;
  max-height: 80vh;
  background: var(--surface-surface-default, #ffffff);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-32) var(--spacing-16) var(--spacing-16);
  animation: fadeIn 0.3s ease-out;
  overflow: hidden;

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

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  img {
    width: 24px;
    height: 24px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
  overflow-y: auto;
`;

const ThumbnailWrapper = styled.div`
  width: 100%;
  height: auto;
  border-radius: 4px;
  overflow: hidden;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  &.default-image {
    height: 200px;
    object-fit: contain;
    background-color: var(--surface-surface-secondary, #f8f8f8);
  }
`;

const Title = styled.h3`
  ${theme.typography.subtitle2};
  color: var(--text-text-title, #1c1c1c);
  text-align: center;
`;

const Description = styled.p`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
  word-break: keep-all;
  text-align: left;
  max-height: 126px;
  overflow-y: auto;
  padding-right: 10px;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--GrayScale-gray400, #bbbbbb);
    border-radius: 4px;
  }
`;
