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

export const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 12px;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;
