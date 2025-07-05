import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { CourseTabType, CourseTabItem, CourseData } from '@/types/course';

import OverviewTab from './tab/OverviewTab';
import CourseTab from './tab/CourseTab';
import AttractionsTab from './tab/AttractionTab';
import ReviewTab from './tab/ReviewTab';

interface CourseTabProps {
  course: CourseData;
}

const TAB_ITEMS: CourseTabItem[] = [
  { key: 'overview', label: '전체' },
  { key: 'course', label: '코스' },
  { key: 'attractions', label: '즐길거리' },
  { key: 'reviews', label: '리뷰' },
];

const Tabs = ({ course }: CourseTabProps) => {
  const [activeTab, setActiveTab] = useState<CourseTabType>('overview');

  const handleTabChange = (tabKey: CourseTabType) => {
    setActiveTab(tabKey);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onTabChange={handleTabChange} course={course} />;
      case 'course':
        return <CourseTab course={course} />;
      case 'attractions':
        return <AttractionsTab />;
      case 'reviews':
        return <ReviewTab />;
      default:
        return <OverviewTab onTabChange={handleTabChange} course={course} />;
    }
  };

  return (
    <Container>
      <TabWrapper>
        {TAB_ITEMS.map(tab => (
          <TabButton key={tab.key} isActive={activeTab === tab.key} onClick={() => handleTabChange(tab.key)}>
            {tab.label}
          </TabButton>
        ))}
      </TabWrapper>
      <TabContent>{renderTabContent()}</TabContent>
    </Container>
  );
};

export default Tabs;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid var(--line-line-001, #eeeeee);
  background: var(--surface-surface-default, #ffffff);
`;

const TabButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  height: 45px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  ${theme.typography.caption1}
  color: ${props => (props.isActive ? 'var(--text-text-title, #1c1c1c)' : 'var(--text-text-secondary, #555555)')};
  font-weight: ${props => (props.isActive ? '600' : '400')};

  &:hover {
    color: var(--text-text-title, #1c1c1c);
    background: var(--surface-surface-highlight, #f4f4f4);
  }

  &:active {
    background: var(--surface-surface-highlight2, #eeeeee);
  }

  ${props =>
    props.isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--line-line-003, #1c1c1c);
    }
  `}
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;
