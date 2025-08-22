import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useIsMobile } from '@/hooks/useIsMobile';

import Header from '@/components/Header';
import { Dropdown, DropdownItem } from '@/components/Dropdown';
import CourseInfoBar from '@/pages/courseCreation/components/CourseInfoBar';
import MoreIconSrc from '@/assets/icons/more-24px.svg';
import TempThumbnail from '@/assets/images/temp-courseCard.png';

const MyCourseDetail = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCopyLink = () => {
    console.log('copy link clicked');
  };

  const handleDeleteClick = () => {
    console.log('delete clicked');
  };

  return (
    <Container>
      <Header title={t('mypage.myCourseDetail.title')} onBack={() => navigate(-1)} />
      <Content>
        <CourseTitleContainer>
          <CourseTitle>
            부산에 놀러갔다가 러닝코스를 그려보고 싶어서 그려본 러닝코스 부산에 놀러갔다가 러닝코스를 그려보고 싶어서 그려본 러닝코스
          </CourseTitle>
          <ButtonWrapper>
            <Button>{t('edit')}</Button>
            <Button>{t('mypage.myCourseDetail.gpxDownload')}</Button>
            <Dropdown trigger={<img src={MoreIconSrc} alt="more" width={24} height={24} />} width={80} padding="0">
              <DropdownItem onClick={handleCopyLink}>{t('mypage.myCourseDetail.copyLink')}</DropdownItem>
              <DropdownItem onClick={handleDeleteClick} variant="danger">
                {t('delete')}
              </DropdownItem>
            </Dropdown>
          </ButtonWrapper>
        </CourseTitleContainer>
        <CourseInfoBar distance={10} time={10} maxAltitude={10} minAltitude={10} ContainerStyle={{ padding: isMobile ? '16px 0' : '24px 0' }} />
        <Thumbnail src={TempThumbnail} alt="thumbnail" />
        <GraphContainer>
          <GraphTitle>{t('mypage.myCourseDetail.altitudeGraph')}</GraphTitle>
        </GraphContainer>
      </Content>
    </Container>
  );
};

export default MyCourseDetail;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: var(--spacing-32);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const CourseTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 16px 0;
  gap: var(--spacing-12);
`;

const CourseTitle = styled.div`
  ${theme.typography.subtitle2};
  color: var(--text-text-title, #1c1c1c);
  display: flex;
  gap: var(--spacing-4);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: wrap;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-8);
`;

const Button = styled.button`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  padding: var(--spacing-8);
  height: 37px;
  border-radius: 4px;
  border: 1px solid var(--border-border-default, #e0e0e0);
  cursor: pointer;
  flex: 1;

  &:hover {
    background: var(--GrayScale-gray050, #fafafa);
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1/1;
`;

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  gap: var(--spacing-12);
`;

const GraphTitle = styled.span`
  ${theme.typography.subtitle3};
  color: var(--text-text-title, #1c1c1c);
`;
