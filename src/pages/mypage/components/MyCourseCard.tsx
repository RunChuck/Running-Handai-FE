import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { Course } from '@/types/create';
import { Dropdown, DropdownItem } from '@/components/Dropdown';
import CommonModal from '@/components/CommonModal';
import CourseEditModal from '@/components/CourseEditModal';
import TempThumbnailImgSrc from '@/assets/images/temp-courseCard.png';
import MoreIconSrc from '@/assets/icons/more-24px.svg';
import DistanceIconSrc from '@/assets/icons/course-distance.svg';
import TimeIconSrc from '@/assets/icons/course-time.svg';
import AltitudeIconSrc from '@/assets/icons/course-max-altitude.svg';

interface MyCourseCardProps {
  variant?: 'mypage' | 'grid';
  course?: Course;
  onEdit?: (courseId: number, startPoint: string, endPoint: string) => void;
  onDelete?: (courseId: number) => void;
}

const MyCourseCard = ({ variant = 'mypage', course, onEdit, onDelete }: MyCourseCardProps) => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCardClick = () => {
    navigate(`/mypage/mycourse/${course?.courseId}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!course?.courseId) return;
    onDelete?.(course.courseId);
    setIsDeleteModalOpen(false);
  };

  const handleEditConfirm = async (startPoint: string, endPoint: string) => {
    if (!course?.courseId) return;
    onEdit?.(course.courseId, startPoint, endPoint);
    setIsEditModalOpen(false);
  };

  const courseInfoItems = [
    {
      icon: DistanceIconSrc,
      alt: 'distance',
      label: `${course?.distance || '-'}km`,
    },
    {
      icon: TimeIconSrc,
      alt: 'time',
      label: `${course?.duration || '-'}분`,
    },
    {
      icon: AltitudeIconSrc,
      alt: 'altitude',
      label: `${course?.maxElevation || '-'}m`,
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
            <CreatedDate $variant={variant}>{new Date(course?.createdAt || '').toLocaleDateString('ko-KR')}</CreatedDate>
            <Dropdown
              trigger={<img src={MoreIconSrc} alt="more" width={20} height={20} />}
              width={80}
              padding="0"
              isOpen={isDropdownOpen}
              onToggle={setIsDropdownOpen}
            >
              <DropdownItem onClick={handleEditClick}>{t('edit')}</DropdownItem>
              <DropdownItem onClick={handleDeleteClick} variant="danger">
                {t('delete')}
              </DropdownItem>
            </Dropdown>
          </RowRapper>
          <CourseName $variant={variant}>{course?.courseName || '코스 이름'}</CourseName>
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

      <CourseEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
        initialStartPoint={course?.courseName?.split('-')[0] || ''}
        initialEndPoint={course?.courseName?.split('-')[1] || ''}
      />

      <CommonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
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
  overflow: visible;
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
  border-radius: 8px 8px 0 0;

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
