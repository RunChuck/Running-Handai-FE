import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { deleteCourse } from '@/api/create';
import type { Course } from '@/types/create';
import { useToast } from '@/hooks/useToast';

import { Dropdown, DropdownItem } from '@/components/Dropdown';
import CommonModal from '@/components/CommonModal';
import TempThumbnailImgSrc from '@/assets/images/temp-courseCard.png';
import MoreIconSrc from '@/assets/icons/more-24px.svg';
import DistanceIconSrc from '@/assets/icons/course-distance.svg';
import TimeIconSrc from '@/assets/icons/course-time.svg';
import AltitudeIconSrc from '@/assets/icons/course-max-altitude.svg';

interface MyCourseCardProps {
  variant?: 'mypage' | 'grid';
  course?: Course;
}

const MyCourseCard = ({ variant = 'mypage', course }: MyCourseCardProps) => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCardClick = () => {
    navigate(`/mypage/mycourse/${course?.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('edit clicked');
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!course?.id) return;

    try {
      await deleteCourse(course.id);

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
    } catch (error) {
      console.error('Course deletion failed:', error);
      showErrorToast('코스 삭제 중 오류가 발생했습니다.');
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const courseInfoItems = [
    {
      icon: DistanceIconSrc,
      alt: 'distance',
      label: `${course?.distance?.toFixed(1) || '0.0'}km`,
    },
    {
      icon: TimeIconSrc,
      alt: 'time',
      label: `${course?.duration || 0}분`,
    },
    {
      icon: AltitudeIconSrc,
      alt: 'altitude',
      label: `${course?.maxElevation?.toFixed(0) || 0}m`,
    },
  ];

  return (
    <>
      <CardContainer $variant={variant} onClick={handleCardClick}>
        <ThumbnailWrapper $variant={variant}>
          <img src={course?.thumbnailUrl || TempThumbnailImgSrc} />
        </ThumbnailWrapper>
        <CourseInfoCard $variant={variant}>
          <RowRapper>
            <CreatedDate $variant={variant}>생성일</CreatedDate>
            <Dropdown trigger={<img src={MoreIconSrc} alt="more" width={20} height={20} />} width={80} padding="0">
              <DropdownItem onClick={handleEditClick}>{t('edit')}</DropdownItem>
              <DropdownItem onClick={handleDeleteClick} variant="danger">
                {t('delete')}
              </DropdownItem>
            </Dropdown>
          </RowRapper>
          <CourseName $variant={variant}>{course?.name || '코스 이름'}</CourseName>
          <CourseInfoWrapper $variant={variant}>
            {courseInfoItems.map((item, index) => (
              <CourseInfoItemGroup key={index} $variant={variant}>
                <CourseInfoItem $variant={variant}>
                  <CourseInfoIcon src={item.icon} alt={item.alt} $variant={variant} />
                  <span>{item.label}</span>
                </CourseInfoItem>
                {index < courseInfoItems.length - 1 && <Divider />}
              </CourseInfoItemGroup>
            ))}
          </CourseInfoWrapper>
        </CourseInfoCard>
      </CardContainer>

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

export default MyCourseCard;

const CardContainer = styled.div<{ $variant: 'mypage' | 'grid' }>`
  display: flex;
  flex-direction: column;
  width: ${({ $variant }) => ($variant === 'grid' ? '272px' : '240px')};
  min-width: ${({ $variant }) => ($variant === 'mypage' ? '240px' : 'unset')};
  min-height: ${({ $variant }) => ($variant === 'mypage' ? '240px' : 'unset')};
  border-radius: 8px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  cursor: pointer;

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      width: 100%;
    }
  `}
`;

const ThumbnailWrapper = styled.div<{ $variant: 'mypage' | 'grid' }>`
  width: 100%;
  height: ${({ $variant }) => ($variant === 'grid' ? '153px' : '135px')};
  overflow: hidden;

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      height: auto;
      aspect-ratio: 16/9;
    }
  `}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 16/9;
  }
`;

const CourseInfoCard = styled.div<{ $variant: 'mypage' | 'grid' }>`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-16);
  gap: var(--spacing-4);

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      padding: var(--spacing-8);
    }
  `}
`;

const RowRapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreatedDate = styled.span<{ $variant: 'mypage' | 'grid' }>`
  ${theme.typography.caption3};
  color: var(--text-text-disabled, #bbbbbb);

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      ${theme.typography.label2};
    }
  `}
`;

const CourseName = styled.span<{ $variant: 'mypage' | 'grid' }>`
  ${theme.typography.subtitle3};
  color: var(--text-text-title, #1c1c1c);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      ${theme.typography.caption2};
    }
  `}
`;

const CourseInfoWrapper = styled.div<{ $variant: 'mypage' | 'grid' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-12);

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      gap: var(--spacing-8);
    }
  `}
`;

const CourseInfoItemGroup = styled.div<{ $variant: 'mypage' | 'grid' }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      gap: var(--spacing-8);
    }
  `}
`;

const CourseInfoItem = styled.div<{ $variant: 'mypage' | 'grid' }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  ${theme.typography.caption1};
  color: var(--text-text-title, #1c1c1c);
  white-space: nowrap;

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      ${theme.typography.caption4};
    }
  `}
`;

const CourseInfoIcon = styled.img<{ $variant: 'mypage' | 'grid' }>`
  width: 16px;
  height: 16px;

  ${({ $variant }) =>
    $variant === 'grid' &&
    `
    @media (max-width: 600px) {
      width: 12px;
      height: 12px;
    }
  `}
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background-color: var(--line-line-002, #e0e0e0);
`;
