import styled from '@emotion/styled';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { theme } from '@/styles/theme';
import { useMyCourses } from '@/hooks/useMyCourses';
import type { SortBy } from '@/types/create';

import Header from '@/components/Header';
import MyCourseCard from '../components/MyCourseCard';
import EmptyIconSrc from '@/assets/icons/no-course.svg';

const MyCoursePage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortBy>('latest');

  const { courses, courseCount, isLoading } = useMyCourses(sortBy);

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'short', label: '짧은 코스' },
    { value: 'long', label: '긴 코스' },
  ];

  return (
    <Container>
      <Header title={t('mypage.myCourse')} onBack={() => navigate(-1)} />
      <Content>
        <HeaderSection>
          <CourseCount>{courseCount}개의 코스</CourseCount>
          <SortSelector>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}>
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </SortSelector>
        </HeaderSection>
        <CardGrid>
          {isLoading ? (
            Array.from({ length: 6 }, (_, index) => <MyCourseCard key={index} variant="grid" />)
          ) : courses.length > 0 ? (
            courses.map(course => <MyCourseCard key={course.id} variant="grid" course={course} />)
          ) : (
            <StatusContainer>
              <img src={EmptyIconSrc} alt="empty" />
              <EmptyText>아직 생성한 코스가 없습니다</EmptyText>
            </StatusContainer>
          )}
        </CardGrid>
      </Content>
    </Container>
  );
};

export default MyCoursePage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: var(--spacing-32);
`;

const Content = styled.div`
  padding: 0 var(--spacing-16);
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-24) 0 var(--spacing-16) 0;
`;

const CourseCount = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1c1c1c;
`;

const SortSelector = styled.div`
  select {
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background-color: white;
    font-size: 14px;
    color: #1c1c1c;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 600px) {
    column-gap: 16px;
  }
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-24) 0;
  gap: var(--spacing-16);
  grid-column: 1 / -1;
`;

const EmptyText = styled.p`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
`;
