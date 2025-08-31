import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import { mapCourseInfo } from '@/utils/format';

import Header from '@/components/Header';
import { Dropdown, DropdownItem } from '@/components/Dropdown';
import CourseInfoBar from '@/pages/courseCreation/components/CourseInfoBar';
import CourseRouteMap from '@/components/CourseRouteMap';
import CommonModal from '@/components/CommonModal';
import MoreIconSrc from '@/assets/icons/more-24px.svg';
import { deleteCourse } from '@/api/create';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';

const MyCourseDetail = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const courseId = parseInt(id || '0', 10);
  const { courseDetail, loading, error } = useCourseDetail(courseId);

  useEffect(() => {
    if (!courseId) {
      navigate('/mypage/mycourse', { replace: true });
    }
  }, [courseId, navigate]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/course/${courseId}`;
    navigator.clipboard.writeText(url);
    showSuccessToast('링크가 복사되었습니다.');
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseId) return;

    try {
      await deleteCourse(courseId);

      // 캐시 무효화
      queryClient.invalidateQueries({
        predicate: query => {
          const [prefix, type] = query.queryKey;
          return prefix === 'courses' && type === 'list';
        },
      });
      queryClient.invalidateQueries({
        predicate: query => {
          const [prefix, type] = query.queryKey;
          return prefix === 'auth' && type === 'my-courses';
        },
      });

      setIsDeleteModalOpen(false);
      showSuccessToast('코스가 삭제되었습니다.');
      navigate('/mypage/mycourse');
    } catch (error) {
      console.error('Course deletion failed:', error);
      showErrorToast('코스 삭제 중 오류가 발생했습니다.');
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  if (loading || !courseDetail) {
    return (
      <Container>
        <Header title={t('mypage.myCourseDetail.title')} onBack={() => navigate(-1)} />
        <Content>
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
        </Content>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header title={t('mypage.myCourseDetail.title')} onBack={() => navigate(-1)} />
        <Content>
          <div style={{ padding: '40px', textAlign: 'center' }}>Error: {error}</div>
        </Content>
      </Container>
    );
  }

  const mappedCourseInfo = mapCourseInfo(courseDetail);

  return (
    <>
      <Container>
        <Header title={t('mypage.myCourseDetail.title')} onBack={() => navigate(-1)} />
        <Content>
          <CourseTitleContainer>
            <CourseTitle>{courseDetail.courseName}</CourseTitle>
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
          <CourseInfoBar
            distance={mappedCourseInfo.distance}
            time={mappedCourseInfo.duration}
            maxAltitude={mappedCourseInfo.maxElevation}
            minAltitude={mappedCourseInfo.minElevation}
            ContainerStyle={{ padding: isMobile ? '16px 0' : '24px 0' }}
          />
          <MapContainer>
            <CourseRouteMap courseDetail={courseDetail} />
          </MapContainer>
          <GraphContainer>
            <GraphTitle>{t('mypage.myCourseDetail.altitudeGraph')}</GraphTitle>
          </GraphContainer>
        </Content>
      </Container>

      <CommonModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        content={t('modal.courseCreation.deleteDesc')}
        cancelText={t('modal.courseCreation.deleteCancel')}
        confirmText={t('modal.courseCreation.deleteConfirm')}
      />
    </>
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

const MapContainer = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 8px;
  overflow: hidden;
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
