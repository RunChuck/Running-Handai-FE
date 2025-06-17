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

export const ControlPanel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CourseButton = styled.button<{ color: string }>`
  padding: 10px 15px;
  background: ${props => props.color};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;
