import styled from '@emotion/styled';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { theme } from '@/styles/theme';
import { useMyCourses, useMyCourseActions } from '@/hooks/useMyCourses';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { SortBy } from '@/types/create';

import Header from '@/components/Header';
import MyCourseCard from '../components/MyCourseCard';
import { DropdownItem } from '@/components/Dropdown';
import SVGColor from '@/components/SvgColor';
import CommonInput from '@/components/CommonInput';
import EmptyIconSrc from '@/assets/icons/no-course.svg';
import ArrowIconSrc from '@/assets/icons/arrow-down-16px.svg';
import SearchIconSrc from '@/assets/icons/search.svg';
import LoadingMotion from '@/assets/animations/run-loading.json';

const MyCoursePage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [actualSearchKeyword, setActualSearchKeyword] = useState('');
  const sortSelectorRef = useRef<HTMLDivElement>(null);

  const { courses, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useMyCourses(sortBy, actualSearchKeyword);
  const { editActions, deleteActions } = useMyCourseActions();

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'short', label: '짧은 코스' },
    { value: 'long', label: '긴 코스' },
  ];

  const currentSortLabel = sortOptions.find(option => option.value === sortBy)?.label || '최신순';

  const handleSortChange = (value: SortBy) => {
    setSortBy(value);
  };

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearch = useCallback(() => {
    setActualSearchKeyword(searchKeyword.trim());
  }, [searchKeyword]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  // 검색어가 비었을 때 자동으로 전체 목록 불러오기
  useEffect(() => {
    if (searchKeyword.trim() === '') {
      setActualSearchKeyword('');
    }
  }, [searchKeyword]);

  const { targetRef } = useIntersectionObserver(handleLoadMore, {
    threshold: 1.0,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortSelectorRef.current && !sortSelectorRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <Container>
      <Header title={t('mypage.myCourse')} onBack={() => navigate('/mypage', { replace: true })} />
      <Content>
        <CommonInput
          placeholder={t('mypage.searchCourse')}
          rightIcon={SearchIconSrc}
          value={searchKeyword}
          onChange={setSearchKeyword}
          onKeyPress={handleKeyPress}
          onRightIconClick={handleSearch}
        />
        <HeaderSection>
          <SortSelector ref={sortSelectorRef}>
            <SortButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <SortText>{currentSortLabel}</SortText>
              <SVGColor
                src={ArrowIconSrc}
                alt="arrow"
                color="#BBBBBB"
                width={16}
                height={16}
                style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </SortButton>
            <SortList isOpen={isDropdownOpen}>
              {sortOptions.map(option => (
                <DropdownItem
                  key={option.value}
                  onClick={() => {
                    handleSortChange(option.value as SortBy);
                    setIsDropdownOpen(false);
                  }}
                >
                  {option.label}
                </DropdownItem>
              ))}
            </SortList>
          </SortSelector>
        </HeaderSection>
        <CardGrid>
          {isLoading && courses.length === 0 ? (
            <StatusContainer>
              <Lottie animationData={LoadingMotion} style={{ width: 100, height: 100 }} loop={true} />
            </StatusContainer>
          ) : courses.length > 0 ? (
            <>
              {courses.map(course => (
                <MyCourseCard
                  key={course.courseId}
                  variant="grid"
                  course={course}
                  onEdit={editActions.handleEditConfirm}
                  onDelete={deleteActions.handleDeleteConfirm}
                />
              ))}
              {hasNextPage && <LoadMoreTrigger ref={targetRef} />}
            </>
          ) : (
            <StatusContainer>
              <img src={EmptyIconSrc} alt="empty" />
              <EmptyText>{t('courseDetail.noCourse')}</EmptyText>
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
  padding: var(--spacing-24) var(--spacing-16);
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: var(--spacing-12) 0;
`;

const SortSelector = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  background: none;
  border: none;
  cursor: pointer;
`;

const SortText = styled.span`
  ${theme.typography.caption1}
  color: var(--text-text-secondary, #555555);

  &:hover {
    color: var(--GrayScale-gray600, #777777);
  }
`;

const SortList = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid var(--line-line-001, #eeeeee);
  border-radius: 4px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 120px;
  overflow: hidden;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transform: ${props => (props.isOpen ? 'translateY(4px)' : 'translateY(0)')};
  transition: all 0.2s ease;
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

const LoadMoreTrigger = styled.div`
  grid-column: 1 / -1;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
