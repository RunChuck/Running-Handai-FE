import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMyCourseDetail } from '@/hooks/useMyCourseDetail';
import { useMyCourseActions } from '@/hooks/useMyCourses';
import { useToast } from '@/hooks/useToast';
import { downloadGpx } from '@/api/create';

import Header from '@/components/Header';
import CourseInfoBar from '@/pages/courseCreation/components/CourseInfoBar';
import CourseRouteMap from '@/components/CourseRouteMap';
import ElevationChart from '@/pages/mypage/mycourse/ElevationChart';
import CommonModal from '@/components/CommonModal';
import CourseEditModal from '@/components/CourseEditModal';
import DeleteIconSrc from '@/assets/icons/delete-icon.svg';

const MyCourseDetail = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const { showSuccessToast, showErrorToast } = useToast();

  const { deleteActions, editActions } = useMyCourseActions({
    onDeleteSuccess: () => navigate(-1),
  });

  const courseId = parseInt(id || '0', 10);
  const { courseDetail, loading, error } = useMyCourseDetail(courseId);

  useEffect(() => {
    if (!courseId || error || (!loading && !courseDetail)) {
      navigate('/mypage/mycourse', { replace: true });
    }
  }, [courseId, error, loading, courseDetail, navigate]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    editActions.handleEditClick();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteActions.handleDeleteClick();
  };

  const handleDeleteConfirm = async () => {
    if (!courseId) return;
    await deleteActions.handleDeleteConfirm(courseId);
  };

  const handleEditConfirm = async (startPoint: string, endPoint: string) => {
    if (!courseId) return;
    await editActions.handleEditConfirm(courseId, startPoint, endPoint);
  };

  const handleGpxDownload = async () => {
    if (!courseId) return;

    try {
      const presignedUrl = await downloadGpx(courseId);

      // URL에서 원본 파일명 추출
      const urlObj = new URL(presignedUrl);
      const pathSegments = urlObj.pathname.split('/');
      const fileName = decodeURIComponent(pathSegments[pathSegments.length - 1].split('?')[0]) || 'course.gpx';

      // presigned URL로 직접 다운로드
      const a = document.createElement('a');
      a.href = presignedUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showSuccessToast(t('toast.gpxDownloaded'));
    } catch (error) {
      console.error('GPX download failed:', error);
      showErrorToast(t('toast.gpxDownloadFailed'));
    }
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

  return (
    <>
      <Container>
        <Header title={t('mypage.myCourseDetail.title')} onBack={() => navigate(-1)} />
        <Content>
          <CourseTitleContainer>
            <CourseTitle>{courseDetail.name}</CourseTitle>
            <ButtonWrapper>
              <Button onClick={handleEditClick}>{t('edit')}</Button>
              <Button onClick={handleGpxDownload}>{t('mypage.myCourseDetail.gpxDownload')}</Button>
              <DeleteButton onClick={handleDeleteClick}>
                <DeleteIcon src={DeleteIconSrc} alt="delete" width={24} height={24} />
              </DeleteButton>
            </ButtonWrapper>
          </CourseTitleContainer>
          <CourseInfoBar
            distance={courseDetail.distance}
            time={courseDetail.duration}
            maxAltitude={courseDetail.maxElevation}
            minAltitude={courseDetail.minElevation}
            ContainerStyle={{ padding: isMobile ? '16px 0' : '24px 0' }}
          />
          <MapContainer>
            <CourseRouteMap courseDetail={courseDetail} />
          </MapContainer>
          <GraphContainer>
            <GraphTitle>{t('mypage.myCourseDetail.altitudeGraph')}</GraphTitle>
            <ElevationChart trackPoints={courseDetail.trackPoints} />
          </GraphContainer>
        </Content>
      </Container>

      <CourseEditModal
        isOpen={editActions.isEditModalOpen}
        onClose={editActions.handleEditCancel}
        onConfirm={handleEditConfirm}
        initialStartPoint={courseDetail?.name?.split('-')[0] || ''}
        initialEndPoint={courseDetail?.name?.split('-')[1] || ''}
      />

      <CommonModal
        isOpen={deleteActions.isDeleteModalOpen}
        onClose={deleteActions.handleDeleteCancel}
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

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: var(--spacing-4);
  border-radius: 4px;
  transition: background-color 0.2s ease;
`;

const DeleteIcon = styled.img`
  filter: brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(96%) contrast(83%);
  transition: filter 0.2s ease;

  ${DeleteButton}:hover & {
    filter: brightness(0) saturate(100%) invert(60%) sepia(58%) saturate(1890%) hue-rotate(325deg) brightness(95%) contrast(85%);
  }
`;
