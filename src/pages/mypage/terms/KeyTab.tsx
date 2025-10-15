import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';

export type KeyTabType = 'pace' | 'distance' | 'body' | 'training' | 'injury' | 'equipment' | 'technique';

interface KeyTabItem {
  key: KeyTabType;
  label: string;
}

const TAB_ITEMS: KeyTabItem[] = [
  { key: 'pace', label: 'mypage.terms.tabs.pace' },
  { key: 'distance', label: 'mypage.terms.tabs.distance' },
  { key: 'body', label: 'mypage.terms.tabs.body' },
  { key: 'training', label: 'mypage.terms.tabs.training' },
  { key: 'injury', label: 'mypage.terms.tabs.injury' },
  { key: 'equipment', label: 'mypage.terms.tabs.equipment' },
  { key: 'technique', label: 'mypage.terms.tabs.technique' },
];

const KeyTab = () => {
  const [t] = useTranslation();
  const [activeTab, setActiveTab] = useState<KeyTabType>('pace');
  const { scrollContainerRef, handleMouseDown } = useHorizontalScroll();

  const handleTabChange = (tabKey: KeyTabType) => {
    setActiveTab(tabKey);
  };

  const getTermsByTab = (tabType: KeyTabType) => {
    const termCounts: Record<KeyTabType, number> = {
      pace: 10,
      distance: 6,
      body: 6,
      training: 5,
      injury: 5,
      equipment: 7,
      technique: 4,
    };

    const count = termCounts[tabType];
    const terms = [];

    for (let i = 1; i <= count; i++) {
      const termData = t(`mypage.terms.${tabType}.content${i}`, { returnObjects: true }) as {
        term: string;
        label: string;
        description: string;
      };
      terms.push(termData);
    }

    return terms;
  };

  const renderTabContent = () => {
    const terms = getTermsByTab(activeTab);

    return (
      <>
        {terms.map((item, index) => (
          <TermItem key={index}>
            <TermWrapper>
              <Term>{item.term}</Term>
              <Dot />
              <TermLabel>{item.label}</TermLabel>
            </TermWrapper>
            <TermDescription>{item.description}</TermDescription>
          </TermItem>
        ))}
      </>
    );
  };

  return (
    <Container>
      <TabWrapper ref={scrollContainerRef} onMouseDown={handleMouseDown} data-scrollable="true">
        {TAB_ITEMS.map(tab => (
          <TabButton key={tab.key} isActive={activeTab === tab.key} onClick={() => handleTabChange(tab.key)}>
            {t(tab.label)}
          </TabButton>
        ))}
      </TabWrapper>
      <TabContent>{renderTabContent()}</TabContent>
    </Container>
  );
};

export default KeyTab;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const TabWrapper = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid var(--line-line-001, #eeeeee);
  background: var(--surface-surface-default, #ffffff);
  overflow-x: auto;
  scroll-behavior: auto;
  padding: 0 var(--spacing-16);

  /* 터치 스크롤 */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  /* 드래그 시 선택 방지 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  touch-action: pan-x;
  cursor: auto;

  &[data-scrollable='true'] {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 600px) {
    justify-content: flex-start;
    padding: 0;
  }
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 12px 24px;
  height: 45px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;

  ${theme.typography.body2}
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
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-24) var(--spacing-16);
  gap: var(--spacing-24);
  background-color: var(--surface-surface-highlight3, #f7f8fa);

  --webkit-scrollbar: none;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TermItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const TermWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
`;

const Term = styled.span`
  ${theme.typography.subtitle3}
  color: var(--text-text-title, #1c1c1c);
`;

const Dot = styled.div`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background-color: var(--GrayScale-gray500, #999999);
`;

const TermLabel = styled.span`
  ${theme.typography.body2}
  color: var(--text-text-disabled, #bbbbbb);
`;

const TermDescription = styled.span`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
  white-space: pre-wrap;
`;
