import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import DistanceIconSrc from '@/assets/icons/course-distance.svg';
import TimeIconSrc from '@/assets/icons/course-time.svg';
import MaxAltitudeIconSrc from '@/assets/icons/course-max-altitude.svg';
import MinAltitudeIconSrc from '@/assets/icons/course-min-altitude.svg';

interface CourseInfoBarProps {
  distance: number;
  time: number;
  maxAltitude: number;
  minAltitude: number;
}

const CourseInfoBar = ({ distance, time, maxAltitude, minAltitude }: CourseInfoBarProps) => {
  const [t] = useTranslation();

  const CourseInfo = [
    {
      id: 1,
      icon: DistanceIconSrc,
      label: t('courseCreation.course.distance'),
      value: `${distance}km`,
    },
    {
      id: 2,
      icon: TimeIconSrc,
      label: t('courseCreation.course.time'),
      value: `${time}${t('courseCreation.course.min')}`,
    },
    {
      id: 3,
      icon: MaxAltitudeIconSrc,
      label: t('courseCreation.course.maxAltitude'),
      value: `${maxAltitude}m`,
    },
    {
      id: 4,
      icon: MinAltitudeIconSrc,
      label: t('courseCreation.course.minAltitude'),
      value: `${minAltitude}m`,
    },
  ];

  return (
    <Container>
      {CourseInfo.map(info => (
        <InfoItem key={info.id}>
          <InfoWrapper>
            <img src={info.icon} alt={info.label} />
            <InfoLabel>{info.label}</InfoLabel>
          </InfoWrapper>
          <InfoValue>{info.value}</InfoValue>
        </InfoItem>
      ))}
    </Container>
  );
};

export default CourseInfoBar;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-12) 0;
  background: #fff;
  box-shadow: 0 3px 4px -2px rgba(0, 0, 0, 0.2);
`;

const InfoItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-right: 1px solid #eee;
  box-sizing: border-box;

  &:last-child {
    border-right: 1px solid transparent;
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

const InfoLabel = styled.span`
  ${theme.typography.body2}

  @media (max-width: 600px) {
    ${theme.typography.label2}
  }
`;

const InfoValue = styled.span`
  ${theme.typography.subtitle3}

  @media (max-width: 600px) {
    ${theme.typography.caption1}
  }
`;