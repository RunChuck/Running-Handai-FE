import type { CourseDetailResponse } from '@/types/course';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import DistanceIconSrc from '@/assets/icons/course-distance.svg';
import TimeIconSrc from '@/assets/icons/course-time.svg';
import MaxAltitudeIconSrc from '@/assets/icons/course-max-altitude.svg';
import MinAltitudeIconSrc from '@/assets/icons/course-min-altitude.svg';
import LevelIconSrc from '@/assets/icons/course-level.svg';

interface CourseTabProps {
  courseDetail: CourseDetailResponse['data'];
}

const CourseTab = ({ courseDetail }: CourseTabProps) => {
  const courseInfoItems = [
    {
      icon: DistanceIconSrc,
      alt: 'distance',
      label: `${courseDetail.distance}km`,
    },
    {
      icon: TimeIconSrc,
      alt: 'time',
      label: `${courseDetail.duration}분`,
    },
    {
      icon: MaxAltitudeIconSrc,
      alt: 'max altitude',
      label: `최고 ${Math.round(courseDetail.maxElevation)}m`,
    },
    {
      icon: MinAltitudeIconSrc,
      alt: 'min altitude',
      label: `최저 ${Math.round(courseDetail.minElevation)}m`,
    },
    {
      icon: LevelIconSrc,
      alt: 'level',
      label: '난이도',
      value: courseDetail.level,
      isSpecial: true,
    },
  ];

  return (
    <Container>
      <CourseInfoWrapper>
        {courseInfoItems.map((item, index) => (
          <CourseInfoItemGroup key={index}>
            <CourseInfoItem>
              <img src={item.icon} alt={item.alt} />
              <span>{item.label}</span>
              {item.isSpecial && <CourseLevel>{item.value}</CourseLevel>}
            </CourseInfoItem>
            {index < courseInfoItems.length - 1 && <Divider />}
          </CourseInfoItemGroup>
        ))}
      </CourseInfoWrapper>

      <CourseAnalysisContainer>
        <CourseAnalysisTitle>AI 코스 분석(추정)</CourseAnalysisTitle>
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

const CourseInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-surface-highlight3, #f7f8fa);
  gap: var(--spacing-12);
  padding: var(--spacing-12);
  border-radius: 4px;
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

  padding: var(--spacing-16);
  gap: var(--spacing-8);
  border-radius: 4px;
  border: 1px solid #c310ff;
`;

const CourseAnalysisTitle = styled.span`
  ${theme.typography.subtitle3};
  background: linear-gradient(90deg, #c310ff 0%, #002bff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const CourseAnalysisContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  padding-left: var(--spacing-16);
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;
