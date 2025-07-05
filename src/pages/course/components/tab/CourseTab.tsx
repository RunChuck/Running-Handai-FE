import type { CourseMockData } from '@/types/course';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import DistanceIconSrc from '@/assets/icons/course-distance.svg';
import TimeIconSrc from '@/assets/icons/course-time.svg';
import MaxAltitudeIconSrc from '@/assets/icons/course-max-altitude.svg';
import MinAltitudeIconSrc from '@/assets/icons/course-min-altitude.svg';
import LevelIconSrc from '@/assets/icons/course-level.svg';

interface CourseTabProps {
  course: CourseMockData;
}

const CourseTab = ({ course }: CourseTabProps) => {
  return (
    <Container>
      {/* TODO: 코스 정보 맵핑으로 변경 */}
      <CourseInfoWrapper>
        <CourseInfoItem>
          <img src={DistanceIconSrc} alt="distance" />
          <span>{course.distance}</span>
        </CourseInfoItem>
        <Divider />
        <CourseInfoItem>
          <img src={TimeIconSrc} alt="time" />
          <span>{course.duration}</span>
        </CourseInfoItem>
        <Divider />
        <CourseInfoItem>
          <img src={MaxAltitudeIconSrc} alt="max altitude" />
          <span>{course.elevation}</span>
        </CourseInfoItem>
        <Divider />
        <CourseInfoItem>
          <img src={MinAltitudeIconSrc} alt="altitude" />
          <span>{course.elevation}</span>
        </CourseInfoItem>
        <Divider />
        <CourseInfoItem>
          <img src={LevelIconSrc} alt="altitude" />
          <span>난이도</span>
          <CourseLevel>쉬움</CourseLevel>
        </CourseInfoItem>
      </CourseInfoWrapper>
      <CourseAnalysisContainer>
        <CourseAnalysisTitle>AI 코스 분석(추정)</CourseAnalysisTitle>
        <CourseAnalysisContent>
          <ul>
            <li>일반적인 도보 트레킹 수준이며, 특별한 등반 장비 없이도 도보 여행이 가능</li>
            <li>일반적인 도보 트레킹 수준이며, 특별한 등반 장비 없이도 도보 여행이 가능</li>
            <li>일반적인 도보 트레킹 수준이며, 특별한 등반 장비 없이도 도보 여행이 가능</li>
            <li>일반적인 도보 트레킹 수준이며, 특별한 등반 장비 없이도 도보 여행이 가능</li>
            <li>
              비교적 긴 거리(약 16.7km)와 누적 고도를 고려할 때 초보자도 완주 가능하지만 중간 이상의 체력이 요구되며,
              체력 부담이 다소 있을 수 있음
            </li>
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
