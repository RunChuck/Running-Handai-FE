import { useTranslation } from 'react-i18next';
import type { CourseDetailResponse } from '@/types/course';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useIsMobile } from '@/hooks/useIsMobile';

import DistanceIconSrc from '@/assets/icons/course-distance.svg';
import TimeIconSrc from '@/assets/icons/course-time.svg';
import MaxAltitudeIconSrc from '@/assets/icons/course-max-altitude.svg';
import MinAltitudeIconSrc from '@/assets/icons/course-min-altitude.svg';
import LevelIconSrc from '@/assets/icons/course-level.svg';

interface CourseTabProps {
  courseDetail: CourseDetailResponse['data'];
}

const CourseTab = ({ courseDetail }: CourseTabProps) => {
  const [t] = useTranslation();
  const isMobile = useIsMobile();

  const courseInfoItems = [
    {
      icon: DistanceIconSrc,
      alt: 'distance',
      label: `${courseDetail.distance % 1 === 0 ? courseDetail.distance : courseDetail.distance.toFixed(2)}km`,
    },
    {
      icon: TimeIconSrc,
      alt: 'time',
      label: `${courseDetail.duration}${t('minutes')}`,
    },
    {
      icon: MaxAltitudeIconSrc,
      alt: 'max altitude',
      label: `${t('max')} ${courseDetail.maxElevation % 1 === 0 ? courseDetail.maxElevation : courseDetail.maxElevation.toFixed(2)}m`,
    },
    {
      icon: MinAltitudeIconSrc,
      alt: 'min altitude',
      label: `${t('min')} ${courseDetail.minElevation % 1 === 0 ? courseDetail.minElevation : courseDetail.minElevation.toFixed(2)}m`,
    },
    {
      icon: LevelIconSrc,
      alt: 'level',
      label: t('level'),
      value: courseDetail.level,
      isSpecial: true,
    },
  ];

  const getItemRows = () => {
    if (isMobile) {
      return [courseInfoItems.slice(0, 3), courseInfoItems.slice(3, 5)];
    }
    return [courseInfoItems];
  };

  const itemRows = getItemRows();

  return (
    <Container>
      <CourseInfoWrapper isMobile={isMobile}>
        {itemRows.map((row, rowIndex) => (
          <CourseInfoRow key={rowIndex}>
            {row.map((item, index) => (
              <CourseInfoItemGroup key={`${rowIndex}-${index}`}>
                <CourseInfoItem>
                  <img src={item.icon} alt={item.alt} />
                  <span>{item.label}</span>
                  {item.isSpecial && <CourseLevel>{item.value}</CourseLevel>}
                </CourseInfoItem>
                {index < row.length - 1 && <Divider />}
              </CourseInfoItemGroup>
            ))}
          </CourseInfoRow>
        ))}
      </CourseInfoWrapper>

      <CourseAnalysisContainer>
        <CourseAnalysisTitle>{t('courseDetail.aiCourseAnalysis')}</CourseAnalysisTitle>
        <CourseAnalysisContent>
          <ul>
            {courseDetail.roadConditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </CourseAnalysisContent>
      </CourseAnalysisContainer>
    </Container>
  );
};

export default CourseTab;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  padding: var(--spacing-24) var(--spacing-16) var(--spacing-40);
`;

const CourseInfoWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: center;
  justify-content: center;
  background-color: var(--surface-surface-highlight3, #f7f8fa);
  gap: ${({ isMobile }) => (isMobile ? 'var(--spacing-8)' : 'var(--spacing-12)')};
  padding: var(--spacing-12);
  border-radius: 4px;
`;

const CourseInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
`;

const CourseInfoItemGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
`;

const CourseInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);

  ${theme.typography.caption1};
  color: var(--text-text-title, #1c1c1c);
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background-color: var(--line-line-002, #e0e0e0);
`;

const CourseLevel = styled.span`
  ${theme.typography.caption1};
  color: var(--text-text-primary, #4561ff);
`;

const CourseAnalysisContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-16);
  gap: var(--spacing-8);
  border-radius: 4px;
  position: relative;
  background: white;

  /* 그라데이션 테두리 효과 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 4px;
    padding: 1px;
    background: linear-gradient(90deg, #c310ff 0%, #002bff 100%);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
  }
`;

const CourseAnalysisTitle = styled.span`
  ${theme.typography.subtitle3};
  background: linear-gradient(90deg, #c310ff 0%, #002bff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
`;

const CourseAnalysisContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--spacing-4);
  padding-left: var(--spacing-16);
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;