import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const CurrentLocationButton = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  width: 40px;
  height: 40px;
  background: var(--black-white-wh, #fff);
  border-radius: 500px;
  box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  img {
    width: 19.5px;
    height: 19.5px;
  }
`;
