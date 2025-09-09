import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import { useToast } from '@/hooks/useToast';
import { deleteCourse, downloadGpx, updateCourse } from '@/api/create';
import { mapCourseInfo } from '@/utils/format';
import { authKeys } from '@/constants/queryKeys';

import Header from '@/components/Header';
import CourseInfoBar from '@/pages/courseCreation/components/CourseInfoBar';
import CourseRouteMap from '@/components/CourseRouteMap';
import CommonModal from '@/components/CommonModal';
import CourseEditModal from '@/components/CourseEditModal';
import DeleteIconSrc from '@/assets/icons/delete-icon.svg';

const MyCourseDetail = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const courseId = parseInt(id || '0', 10);
  const { courseDetail, loading, error } = useCourseDetail(courseId);

  useEffect(() => {
    if (!courseId) {
      navigate('/mypage/mycourse', { replace: true });
    }
  }, [courseId, navigate]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
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
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      queryClient.invalidateQueries({
        predicate: query => {
          const [prefix, type] = query.queryKey;
          return prefix === 'courses' && type === 'list';
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

  const handleEditConfirm = async (startPoint: string, endPoint: string) => {
    if (!courseId) return;

    try {
      await updateCourse(courseId, {
        startPointName: startPoint,
        endPointName: endPoint,
      });

      // 캐시 무효화
      queryClient.invalidateQueries({
        predicate: query => {
          const [prefix, type] = query.queryKey;
          return prefix === 'auth' || (prefix === 'courses' && (type === 'list' || type === 'detail'));
        },
      });

      setIsEditModalOpen(false);
      showSuccessToast('코스가 수정되었습니다.');
    } catch (error) {
      console.error('Course update failed:', error);
      showErrorToast('코스 수정 중 오류가 발생했습니다.');
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
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

      showSuccessToast('GPX 파일이 다운로드되었습니다.');
    } catch (error) {
      console.error('GPX download failed:', error);
      showErrorToast('GPX 다운로드 중 오류가 발생했습니다.');
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

  const mappedCourseInfo = mapCourseInfo(courseDetail);

  return (
    <>
      <Container>
        <Header title={t('mypage.myCourseDetail.title')} onBack={() => navigate(-1)} />
        <Content>
          <CourseTitleContainer>
            <CourseTitle>{courseDetail.courseName}</CourseTitle>
            <ButtonWrapper>
              <Button onClick={handleEditClick}>{t('edit')}</Button>
              <Button onClick={handleGpxDownload}>{t('mypage.myCourseDetail.gpxDownload')}</Button>
              <DeleteButton onClick={handleDeleteClick}>
                <DeleteIcon src={DeleteIconSrc} alt="delete" width={24} height={24} />
              </DeleteButton>
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

      <CourseEditModal
        isOpen={isEditModalOpen}
        onClose={handleEditCancel}
        onConfirm={handleEditConfirm}
        initialStartPoint={courseDetail?.courseName?.split('-')[0] || ''}
        initialEndPoint={courseDetail?.courseName?.split('-')[1] || ''}
      />

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
